import { useState } from "react";
import { useCreateReviewMutation } from "../features/api/reviewApi"; // Adjust the path if needed
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const ReviewForm = () => {
  const { courseId } = useParams();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [createReview, { isLoading, isError, error }] = useCreateReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast.error("Please provide a rating and a comment.");
      return;
    }

    try {
      const reviewData = {
        rating,
        comment,
        courseId, // Pass the courseId to associate the review with the course
      };

      await createReview(reviewData).unwrap(); // unwrap() is used to handle success/error

      toast.success("Review submitted successfully!");
      setComment(""); // Reset form fields
      setRating(0);
    } catch (err) {
      toast.error("Failed to submit the review.");
      console.error(error);
    }
  };

  return (
    <Card className="w-full mt-6 dark:bg-[#1E1F20] bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Leave a Review</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={i < rating ? "#FACC15" : "none"}
                  viewBox="0 0 24 24"
                  stroke="#FACC15"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.235 3.802a1 1 0 00.95.69h4.004c.969 0 1.371 1.24.588 1.81l-3.24 2.354a1 1 0 00-.364 1.118l1.235 3.802c.3.921-.755 1.688-1.538 1.118l-3.24-2.354a1 1 0 00-1.176 0l-3.24 2.354c-.783.57-1.838-.197-1.538-1.118l1.235-3.802a1 1 0 00-.364-1.118L2.22 9.229c-.783-.57-.38-1.81.588-1.81h4.004a1 1 0 00.95-.69l1.235-3.802z"
                  />
                </svg>
              </button>
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Review"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReviewForm;
