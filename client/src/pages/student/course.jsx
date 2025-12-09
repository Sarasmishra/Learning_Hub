// src/components/courses/Course.jsx
import React from "react";
import DOMPurify from "dompurify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

/**
 * Simple Course Card — minimal / airy
 * Shows: thumbnail, title (2 lines), instructor, level badge, price
 * Keeps consistent heights and minimal visual noise.
 */

const Course = ({ course = {}, view = "grid" }) => {
  const thumbnail = course.courseThumbnail || "https://via.placeholder.com/600x360?text=Course";
  const title = course.courseTitle || course.title || "Untitled course";
  const instructor = course.creator?.name || "Unknown instructor";
  const instructorImg = course.creator?.photoUrl || null;
  const level = course.courseLevel || "All Levels";
  const price = typeof course.coursePrice !== "undefined" ? `₹${course.coursePrice}` : "Free";

  // sanitize and strip tags for a very short preview (keeps card simple)
  const rawHtml = course.description || course.courseDescription || "";
  const safeHtml = DOMPurify.sanitize(rawHtml);
  const plainTextPreview = safeHtml.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 90); // 90 chars

  const initials = instructor
    .split(" ")
    .map((n) => n[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // LIST view (kept minimal)
  if (view === "list") {
    return (
      <Link
        to={`/course-detail/${course._id || course.id}`}
        className="flex gap-4 items-start group"
        aria-label={`View course ${title}`}
      >
        <div className="w-40 h-24 flex-shrink-0 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
          <img
            src={thumbnail}
            alt={title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
              {title}
            </h3>

            <div className="text-right flex-shrink-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {price}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{level}</div>
            </div>
          </div>

          {/* very short preview */}
          {plainTextPreview && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 truncate">
              {plainTextPreview}
              {plainTextPreview.length >= 90 ? "…" : ""}
            </p>
          )}

          <div className="mt-3 flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {instructorImg ? (
                <AvatarImage src={instructorImg} alt={instructor} />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="text-sm">
              <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                {instructor}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // GRID view: simplified card
  return (
    <Link to={`/course-detail/${course._id || course.id}`} aria-label={`View course ${title}`}>
      <Card className="group overflow-hidden rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-200">
        {/* Image area: fixed height for consistent cards */}
        <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" loading="lazy" />

          <div className="absolute top-3 left-3">
            <Badge className="bg-white/95 text-slate-900 px-2 py-0.5 text-xs">
              {level}
            </Badge>
          </div>
        </div>

        <CardContent className="px-4 py-4 flex flex-col gap-2 min-h-[120px]">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
            {title}
          </h3>

          {/* only a tiny preview line to keep card airy */}
          {plainTextPreview && (
            <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
              {plainTextPreview}
              {plainTextPreview.length >= 90 ? "…" : ""}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {instructorImg ? (
                  <AvatarImage src={instructorImg} alt={instructor} />
                ) : (
                  <AvatarFallback>{initials}</AvatarFallback>
                )}
              </Avatar>
              <div className="text-sm">
                <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                  {instructor}
                </div>
              </div>
            </div>

            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {price}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
