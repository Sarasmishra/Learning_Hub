import React from "react";
import Courses from "./Courses";
import { Link } from "react-router-dom";

const CoursesPage = () => {
  return (
    <main className="pt-20 min-h-screen bg-gray-50 dark:bg-[#0b0b0b]">
      
      {/* Breadcrumb + Page Title */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Courses</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            Browse All Courses
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Discover hundreds of curated courses across various categories.
          </p>
        </div>
      </div>

      {/* Course List Component */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Courses />
      </div>

    </main>
  );
};

export default CoursesPage;
