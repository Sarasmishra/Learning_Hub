import { useState } from "react";
import { useDeleteReviewMutation } from "../features/api/reviewApi"; // Assuming this is your delete mutation
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TrashIcon } from "@heroicons/react/24/outline"

const ReviewCard = ({ review, currentUser }) => {
  const [deleteReview, { isLoading }] = useDeleteReviewMutation();

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId).unwrap();
      toast.success("Review deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete the review.");
    }
  };

  return (
    <Card className="w-full mt-4 dark:bg-[#1E1F20] bg-white">
      <CardHeader>
        <CardTitle className="text-lg">{review.user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            
            <span className="text-yellow-400">Rating:</span>
            {[...Array(review.rating)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                fill="#FACC15"
                viewBox="0 0 24 24"
                stroke="#FACC15"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.235 3.802a1 1 0 00.95.69h4.004c.969 0 1.371 1.24.588 1.81l-3.24 2.354a1 1 0 00-.364 1.118l1.235 3.802c.3.921-.755 1.688-1.538 1.118l-3.24-2.354a1 1 0 00-1.176 0l-3.24 2.354c-.783.57-1.838-.197-1.538-1.118l1.235-3.802a1 1 0 00-.364-1.118L2.22 9.229c-.783-.57-.38-1.81.588-1.81h4.004a1 1 0 00.95-.69l1.235-3.802z"
                />
              </svg>
            ))}
          </div>
          
          <p>{review.comment}</p>
        </div>
      </CardContent>
      <CardFooter>
        {currentUser && currentUser._id === review.user._id && (
          <Button
            className="ml-auto"
            onClick={() => handleDelete(review._id)}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : <TrashIcon className="w-5 h-5"/>}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
