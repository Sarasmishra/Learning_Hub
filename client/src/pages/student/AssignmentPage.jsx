// src/pages/student/AssignmentsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useFetchFileAssignmentsQuery } from "@/features/api/fileAssignmentApi";
import { useFetchQuizAssignmentsQuery } from "@/features/api/quizAssignmentApi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // if exists; else swap with native select

// Small helper: format ISO date -> readable + relative
function formatDeadline(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Invalid date";

    const now = new Date();
    const diffMs = d - now;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    // absolute format
    const abs = d.toLocaleDateString();
    // relative
    let relative;
    if (diffDays === 0) relative = "today";
    else if (diffDays === 1) relative = "tomorrow";
    else if (diffDays === -1) relative = "yesterday";
    else if (diffDays > 1) relative = `in ${diffDays} days`;
    else relative = `${Math.abs(diffDays)} days ago`;

    return `${abs} • ${relative}`;
  } catch {
    return iso;
  }
}

function computeStatus(assignment) {
  // Non-breaking: if API provides a submitted flag or submission date, use it
  const now = new Date();
  const deadline = assignment?.deadline ? new Date(assignment.deadline) : null;
  const submitted = Boolean(assignment?.submitted || assignment?.submissionDate);
  if (submitted) return "submitted";
  if (!deadline) return "pending";
  if (deadline < now) return "overdue";
  return "pending";
}

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
    <div className="h-36 bg-slate-100 rounded" />
  </div>
);

const AssignmentsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    data: fileAssignments = [],
    error: fileError,
    isLoading: isLoadingFiles,
    refetch: refetchFiles,
  } = useFetchFileAssignmentsQuery(courseId);

  const {
    data: quizAssignments = [],
    error: quizError,
    isLoading: isLoadingQuizzes,
    refetch: refetchQuizzes,
  } = useFetchQuizAssignmentsQuery(courseId);

  useEffect(() => {
    if (fileError || quizError) {
      toast.error(`Error loading assignments: ${fileError?.message || quizError?.message || "Unknown"}`);
    }
  }, [fileError, quizError]);

  // UI: search + sort state (client-side)
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("deadline"); // deadline | newest | title

  const mergedLoading = isLoadingFiles || isLoadingQuizzes;

  // client-side filter & sort helpers
  const filterAndSort = (list) => {
    if (!Array.isArray(list)) return [];

    let res = list.slice();

    // search on title/description
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      res = res.filter((a) => {
        const t = (a.title || "").toLowerCase();
        const d = (a.description || "").toLowerCase();
        return t.includes(q) || d.includes(q);
      });
    }

    if (sortBy === "deadline") {
      res.sort((a, b) => {
        const da = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
        const db = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
        return da - db;
      });
    } else if (sortBy === "newest") {
      res.sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });
    } else if (sortBy === "title") {
      res.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    return res;
  };

  const visibleFileAssignments = useMemo(() => filterAndSort(fileAssignments), [fileAssignments, query, sortBy]);
  const visibleQuizAssignments = useMemo(() => filterAndSort(quizAssignments), [quizAssignments, query, sortBy]);

  const handleViewAssignment = (assignmentId) => {
    navigate(`file/${assignmentId}`);
  };

  const handleTakeQuiz = (assignmentId) => {
    navigate(`quiz/${assignmentId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Assignments</h2>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-6 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search assignments by title or description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* If you don't have a Select component, replace with native select */}
          <div>
            <select
              className="h-10 rounded-md border bg-white dark:bg-slate-800 px-3"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="deadline">Sort by deadline</option>
              <option value="newest">Sort by newest</option>
              <option value="title">Sort by title</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setQuery(""); setSortBy("deadline"); }}>
              Reset
            </Button>
            <Button onClick={() => { refetchFiles(); refetchQuizzes(); }}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* File Assignments */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">📁 File Assignments</h3>
          <div className="text-sm text-slate-500">{visibleFileAssignments.length} item(s)</div>
        </div>

        <Separator className="mb-6" />

        {mergedLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : visibleFileAssignments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {visibleFileAssignments.map((assignment) => {
              const status = computeStatus(assignment);
              return (
                <Card key={assignment._id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-slate-700 dark:text-slate-300 mb-3">{assignment.description}</p>

                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="text-sm text-slate-500">
                        Deadline: <span className="font-medium">{formatDeadline(assignment.deadline)}</span>
                      </div>

                      <div>
                        {status === "submitted" && <Badge className="bg-green-100 text-green-700">Submitted</Badge>}
                        {status === "overdue" && <Badge className="bg-red-100 text-red-700">Overdue</Badge>}
                        {status === "pending" && <Badge className="bg-yellow-50 text-yellow-700">Pending</Badge>}
                      </div>
                    </div>

                    <div className="mt-2">
                      <Button className="w-full" onClick={() => handleViewAssignment(assignment._id)}>
                        View Assignment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">No file assignments available.</div>
        )}
      </section>

      {/* Quiz Assignments */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">📝 Quiz Assignments</h3>
          <div className="text-sm text-slate-500">{visibleQuizAssignments.length} item(s)</div>
        </div>

        <Separator className="mb-6" />

        {mergedLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : visibleQuizAssignments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {visibleQuizAssignments.map((assignment) => {
              const status = computeStatus(assignment);
              return (
                <Card key={assignment._id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-slate-700 dark:text-slate-300 mb-3">{assignment.description}</p>

                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="text-sm text-slate-500">
                        Deadline: <span className="font-medium">{formatDeadline(assignment.deadline)}</span>
                      </div>

                      <div>
                        {status === "submitted" && <Badge className="bg-green-100 text-green-700">Submitted</Badge>}
                        {status === "overdue" && <Badge className="bg-red-100 text-red-700">Overdue</Badge>}
                        {status === "pending" && <Badge className="bg-yellow-50 text-yellow-700">Pending</Badge>}
                      </div>
                    </div>

                    <div className="mt-2">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => handleTakeQuiz(assignment._id)}>
                        Take Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">No quiz assignments available.</div>
        )}
      </section>
    </div>
  );
};

export default AssignmentsPage;
