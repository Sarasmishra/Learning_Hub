import React from "react";
import { useGetPurchasedCoursesQuery } from "../../features/api/purchaseApi";

import MyLearningSkeleton from "../../components/ui/MyLearningSkeleton"; // Assuming the skeleton is imported here
import PurchasedCourseCard from "@/components/ui/PurchasedCourseCard";
const MyLearning = () => {
  // Fetching purchased courses using the useGetPurchasedCoursesQuery hook
  const { data, isLoading } = useGetPurchasedCoursesQuery();

  console.log("data - ", data); // To debug and check the structure

  // Handling the case when no courses are available
  if (isLoading) {
    return <MyLearningSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
      <h1 className="font-bold text-2xl">MY LEARNING</h1>
      <div className="my-5">
        {/* Check if courses exist */}
        {Array.isArray(data?.purchasedCourse) && data.purchasedCourse.length === 0 ? (
          <p>You are not enrolled in any courses</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Map over purchasedCourse */}
            {data?.purchasedCourse?.map((course) => (
              <PurchasedCourseCard  key={course._id} course={course.courseId}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;