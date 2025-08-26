import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useDeleteFileAssignmentMutation,
  useFetchAllFileAssignmentsForInstructorQuery,
} from '../../../features/api/fileAssignmentApi';
import {
  useDeleteQuizAssignmentMutation,
  useFetchAllQuizAssignmentsForInstructorQuery,
} from '../../../features/api/quizAssignmentApi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

const AssignmentsTable = () => {
  const navigate = useNavigate();

  const { data: fileData = { assignments: [] }, isLoading: fileLoading } = useFetchAllFileAssignmentsForInstructorQuery();
  const { data: quizData = { assignments: [] }, isLoading: quizLoading } = useFetchAllQuizAssignmentsForInstructorQuery();

  const [deleteFileAssignment] = useDeleteFileAssignmentMutation();
  const [deleteQuizAssignment] = useDeleteQuizAssignmentMutation();

  const [open, setOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleDelete = async () => {
    try {
      console.log("assignment id -",selectedAssignment._id  , "courseId - ",selectedAssignment.course._id)
      if (selectedAssignment.type === 'file') {
        await deleteFileAssignment({ courseId: selectedAssignment.course._id, assignmentId: selectedAssignment._id });
        toast.success('File Assignment deleted successfully!');
      } else {
        await deleteQuizAssignment({ courseId: selectedAssignment.course._id, assignmentId: selectedAssignment._id });
        toast.success('Quiz Assignment deleted successfully!');
      }
    } catch {
      toast.error('Failed to delete assignment.');
    } finally {
      setOpen(false);
      setSelectedAssignment(null);
    }
  };

  const handleEditAssignment = (type, id) => {
    navigate(`/admin/assignments/edit/${type}/${id}`);
  };

  if (fileLoading || quizLoading) return <h1 className="text-black dark:text-black">Loading...</h1>;

  const allAssignments = [
    ...fileData.assignments.map((a) => ({ ...a, type: 'file' })),
    ...quizData.assignments.map((a) => ({ ...a, type: 'quiz' })),
  ];

  return (
    <div className="text-black dark:text-black">
      <Button className="flex mb-4 " onClick={() => navigate('create')}>
        Add New Assignment
      </Button>

      <Table>
        <TableCaption>A list of your recent assignments.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAssignments.map((assignment) => (
            <TableRow key={assignment._id}>
              <TableCell>{assignment.type === 'file' ? 'File' : 'Quiz'}</TableCell>
              <TableCell>{assignment.course.category}</TableCell>
              <TableCell>{assignment.title}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditAssignment(assignment.type, assignment._id)}
                >
                  <Edit />
                </Button>
                <AlertDialog open={open && selectedAssignment?._id === assignment._id} onOpenChange={setOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the assignment.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Yes, Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssignmentsTable;
