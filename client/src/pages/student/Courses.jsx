import React, { useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Course from "./course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";
import { ChevronDown, Grid as GridIcon, List as ListIcon } from "lucide-react";

/**
 * Modern Courses list
 * - Client-side search (debounced)
 * - Category chips
 * - Sort & view toggle (grid / list)
 * - Load more progressive reveal
 * - Reuses Course component
 */

const PAGE_SIZE = 8;

const Courses = () => {
  const { data, isLoading, isError, refetch } = useGetPublishedCourseQuery();
  const allCourses = data?.courses || [];

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance"); // relevance | newest | popular
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [view, setView] = useState("grid"); // grid | list

  const searchRef = useRef(null);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [allCourses.length]);

  // categories
  const categories = useMemo(() => {
    const set = new Set();
    allCourses.forEach((c) => {
      if (c.category) set.add(c.category);
      if (Array.isArray(c.tags)) c.tags.forEach((t) => set.add(t));
    });
    return ["all", ...Array.from(set)];
  }, [allCourses]);

  const filteredCourses = useMemo(() => {
    if (!allCourses || allCourses.length === 0) return [];

    let filtered = allCourses.slice();

    if (category !== "all") {
      filtered = filtered.filter((c) => {
        const catMatch = c.category === category;
        const tagMatch = Array.isArray(c.tags) && c.tags.includes(category);
        return catMatch || tagMatch;
      });
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter((c) => {
        const title = (c.courseTitle || "").toLowerCase();
        const desc = (c.description || c.courseDescription || "").toLowerCase();
        const instructor = (c.creator?.name || "").toLowerCase();
        return title.includes(q) || desc.includes(q) || instructor.includes(q);
      });
    }

    if (sortBy === "newest") {
      filtered.sort((a, b) => {
        const ta = new Date(a.publishedAt || a.createdAt || 0).getTime();
        const tb = new Date(b.publishedAt || b.createdAt || 0).getTime();
        return tb - ta;
      });
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => {
        const pa = Number(a.enrollments || a.studentsCount || a.rating || 0);
        const pb = Number(b.enrollments || b.studentsCount || b.rating || 0);
        return pb - pa;
      });
    }

    return filtered;
  }, [allCourses, category, debouncedSearch, sortBy]);

  const visibleCourses = useMemo(
    () => filteredCourses.slice(0, visibleCount),
    [filteredCourses, visibleCount]
  );

  const loadMore = () =>
    setVisibleCount((v) => Math.min(filteredCourses.length, v + PAGE_SIZE));

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setSortBy("relevance");
    setVisibleCount(PAGE_SIZE);
    if (searchRef.current) searchRef.current.focus();
  };

  return (
    <section className="bg-transparent">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Explore courses</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Filter, sort and discover the course that's right for you.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full shadow-sm px-3 py-1">
            <Input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, topics, instructors..."
              className="border-none h-9 w-64 bg-transparent placeholder-slate-400 dark:placeholder-slate-500"
            />
            <button
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
              }}
              className="text-xs text-slate-500 px-2"
              aria-label="Clear search"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <select
                className="h-9 rounded-md border bg-white dark:bg-slate-800 px-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All categories" : cat}
                  </option>
                ))}
              </select>

              <div className="relative">
                <select
                  className="h-9 rounded-md border bg-white dark:bg-slate-800 px-2 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort courses"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Popular</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 pointer-events-none" size={14} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-md ${view === "grid" ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-900"}`}
                aria-label="Grid view"
                title="Grid view"
              >
                <GridIcon size={16} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md ${view === "list" ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-900"}`}
                aria-label="List view"
                title="List view"
              >
                <ListIcon size={16} />
              </button>

              <Button variant="ghost" onClick={resetFilters} className="hidden sm:inline-flex">
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {isError ? (
        <div className="py-12 text-center">
          <p className="mb-4">Oops — failed to load courses.</p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => refetch()}>Retry</Button>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Home
            </Button>
          </div>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <CardSkeleton key={i} view={view} />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-700 dark:text-slate-300 mb-4">No courses found. Try adjusting filters.</p>
              <Button onClick={resetFilters}>Reset filters</Button>
            </div>
          ) : (
            <>
              <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col divide-y"}>
                {visibleCourses.map((course, idx) => (
                  <div key={course._id || course.id || idx} className={view === "grid" ? "" : "py-4"}>
                    <Course course={course} view={view} />
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center">
                {visibleCount < filteredCourses.length ? (
                  <Button onClick={loadMore}>Load more</Button>
                ) : (
                  <div className="text-sm text-slate-600 dark:text-slate-400">Showing all {filteredCourses.length} courses</div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
};

export default Courses;

/* ---------- helpers ---------- */

const CardSkeleton = ({ view = "grid" }) => {
  if (view === "list") {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="w-36 h-20 rounded-md" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-1" />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
      <Skeleton className="w-full h-44" />
      <div className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-2" />
        <Skeleton className="h-8 w-24 rounded-full mt-3" />
      </div>
    </div>
  );
};
