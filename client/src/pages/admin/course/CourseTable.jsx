import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";

import React from "react";
import { useNavigate } from "react-router-dom";

const CourseTable = () => {
  const { data, isLoading } = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  if (isLoading)
    return <h1 className="text-black dark:text-black">Loading...</h1>;

  return (
    <div className="text-black dark:text-black">
      <Button className="flex mb-4" onClick={() => navigate(`create`)}>
        Create a new course
      </Button>
      <Table>
        <TableCaption className="text-black dark:text-black">
          A list of your recent courses.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-black dark:text-black">
              Price
            </TableHead>
            <TableHead className="text-black dark:text-black">Status</TableHead>
            <TableHead className="text-black dark:text-black">Title</TableHead>
            <TableHead className="text-right text-black dark:text-black">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium flex text-black dark:text-black">
                {course?.coursePrice || "NA"}
              </TableCell>
              <TableCell className="font-medium text-left text-black dark:text-black">
                {course.isPublished ? "Published" : "Draft"}
              </TableCell>
              <TableCell className="flex text-black dark:text-black">
                {course.courseTitle}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`${course._id}`)}
                >
                  <Edit className="text-black dark:text-black" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
