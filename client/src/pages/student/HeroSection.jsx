import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery("");
  };

  return (
    <section
      className="relative overflow-hidden mt-9"
      aria-label="Hero section: search and explore courses"
    >
      {/* Background gradients / shapes */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -left-32 -top-32 w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 opacity-30 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 opacity-20 blur-2xl" />
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left content */}
          <div className="md:col-span-7">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                Find the Best Courses for You
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Discover, learn, and upskill with curated courses built by
                industry experts. Track progress, earn certificates and grow.
              </p>

              <form
                onSubmit={searchHandler}
                className="mt-8 flex items-center gap-3 max-w-2xl"
                role="search"
                aria-label="Search courses"
              >
                <label htmlFor="hero-search" className="sr-only">
                  Search courses
                </label>
                <div className="flex-grow bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center overflow-hidden">
                  <Input
                    id="hero-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, e.g. React, Node, UI Design..."
                    className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 h-12"
                  />
                </div>

                <Button
                  type="submit"
                  className="rounded-full px-6 py-3 h-12 flex items-center justify-center shadow"
                >
                  Search
                </Button>
              </form>

              <div className="mt-4">
                <Button
                  onClick={() => navigate("/course/search?query")}
                  variant="ghost"
                  className="rounded-full bg-white/90 dark:bg-slate-800/80 text-indigo-600 dark:text-indigo-300 px-5 py-2.5 hover:scale-[1.01] transition"
                  aria-label="Explore courses"
                >
                  Explore Courses
                </Button>
              </div>

              <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                Recommended: <span className="font-medium">Frontend, Backend, Data Science</span>
              </div>
            </div>
          </div>

          {/* Right illustration / quick stats */}
          <div className="md:col-span-5 hidden md:flex justify-center">
            <div className="w-full max-w-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30">
              <div className="text-sm text-slate-700 dark:text-slate-200 font-semibold">
                Top Categories
              </div>

              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li>• Web Development — 120 courses</li>
                <li>• Machine Learning — 65 courses</li>
                <li>• UI / UX Design — 40 courses</li>
              </ul>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <StatItem label="Students" value="45k+" />
                <StatItem label="Courses" value="1.2k+" />
                <StatItem label="Instructors" value="350+" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatItem = ({ label, value }) => (
  <div className="flex flex-col items-start">
    <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</div>
  </div>
);

export default HeroSection;
