import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useFetchFileAssignmentsQuery } from '@/features/api/fileAssignmentApi';
import { useFetchQuizAssignmentsQuery } from '@/features/api/quizAssignmentApi';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const AssignmentsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data: fileAssignments, error: fileError, isLoading: isLoadingFiles } = useFetchFileAssignmentsQuery(courseId);
  const { data: quizAssignments, error: quizError, isLoading: isLoadingQuizzes } = useFetchQuizAssignmentsQuery(courseId);

  useEffect(() => {
    if (fileError || quizError) {
      toast.error(`Error: ${fileError?.message || quizError?.message}`);
    }
  }, [fileError, quizError]);

  const handleViewAssignment = (assignmentId) => {
    navigate(`file/${assignmentId}`);
  };

  if (isLoadingFiles || isLoadingQuizzes) return <p className="text-center mt-10 text-lg">Loading assignments...</p>;
  if (fileError || quizError) return <p className="text-center text-red-500 mt-10">Error loading assignments</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-bold text-center mb-10">Assignments for Course <Badge>{courseId}</Badge></h2>

      {/* File Assignments */}
      <section>
        <h3 className="text-2xl font-semibold mb-4">📁 File Assignments</h3>
        <Separator className="mb-6" />
        {fileAssignments && fileAssignments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {fileAssignments.map((assignment) => (
              <Card key={assignment._id} className="hover:shadow-xl transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{assignment.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Deadline: <span className="font-medium">{assignment.deadline}</span>
                  </p>
                  <Button
                    className="w-full text-white bg-primary hover:bg-blue-700   dark:hover:bg-blue dark:text-black"
                    onClick={() => handleViewAssignment(assignment._id)}
                  >
                    View Assignment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No file assignments available.</p>
        )}
      </section>

      {/* Quiz Assignments */}
      <section className="mt-14">
        <h3 className="text-2xl font-semibold mb-4">📝 Quiz Assignments</h3>
        <Separator className="mb-6" />
        {quizAssignments && quizAssignments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {quizAssignments.map((assignment) => (
              <Card key={assignment._id} className="hover:shadow-xl transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{assignment.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Deadline: <span className="font-medium">{assignment.deadline}</span>
                  </p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => navigate(`quiz/${assignment._id}`)}
                  >
                    Take Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No quiz assignments available.</p>
        )}
      </section>
    </div>
  );
};

export default AssignmentsPage;
