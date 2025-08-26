import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchQuizAssignmentByIdQuery } from "@/features/api/quizAssignmentApi";
import { useSubmitQuizMutation } from "@/features/api/submissionApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AssignmentDetails = () => {
  const { assignmentId } = useParams();
const { data: quiz, isLoading, error } = useFetchQuizAssignmentByIdQuery(assignmentId);
  const [submitQuiz] = useSubmitQuizMutation();



  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
      console.log(quiz)
    if (quiz?.duration) {
      setTimeLeft(quiz.duration * 60);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const handleSelect = (qId, answer) => {
    setAnswers({ ...answers, [qId]: answer });
  };

  const handleSubmit = async () => {
    const payload = {
      assignmentId,
      answers: quiz.quizQuestions.map((q) => ({
        questionId: q._id,
        selectedOption: answers[q._id] || "",
      })),
    };

    try {
      const res = await submitQuiz(payload).unwrap();
      setIsSubmitted(true);
      setResult(res);
      toast.success("Quiz submitted!");
    } catch (err) {
      toast.error("Failed to submit quiz.");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error || !quiz) return <p className="text-center text-red-500 mt-10">Failed to load quiz.</p>;

//   return (
//     <div className="w-full min-h-screen p-6 md:p-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//       {/* Assignment Info */}
//       <div className="space-y-2 mb-6">
//         <h2 className="text-2xl font-bold">Assignment Info</h2>
//         <p><strong>Instructor:</strong> {quiz.createdBy?.name || "N/A"}</p>
//         <p><strong>Total Questions:</strong> {quiz.quizQuestions.length}</p>
//         <p><strong>Duration:</strong> {quiz.duration} mins</p>
//         <p><strong>Passing Marks:</strong> {quiz.passingMarks}</p>
//         <p><strong>Time Left:</strong> {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</p>
//       </div>

//       {/* Detailed Instructions */}
//       <div className="mb-10">
//         <h3 className="text-xl font-semibold mb-2">Detailed Instructions:</h3>
//         <div
//           className="prose dark:prose-invert max-w-none"
//           dangerouslySetInnerHTML={{ __html: quiz.detailedInstruction }}
//         />
//       </div>

//       {/* Quiz Section */}
//       {!isSubmitted ? (
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSubmit();
//           }}
//           className="space-y-8"
//         >
//           {quiz.quizQuestions.map((q, index) => (
//             <div key={q._id} className="space-y-3 border-b pb-6">
//               <p className="text-lg font-medium">
//                 Q{index + 1}. {q.question}
//               </p>
//               <div className="space-y-2">
//                 {q.options.map((opt) => (
//                   <label
//                     key={opt._id}
//                     className={`block px-4 py-2 border rounded cursor-pointer transition ${
//                       answers[q._id] === opt.optionText
//                         ? "bg-blue-100 dark:bg-blue-800 border-blue-500"
//                         : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name={q._id}
//                       value={opt.optionText}
//                       checked={answers[q._id] === opt.optionText}
//                       onChange={() => handleSelect(q._id, opt.optionText)}
//                       className="hidden"
//                     />
//                     {opt.optionText}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           ))}

//           <Button type="submit" className="w-full mt-6">
//             Submit Quiz
//           </Button>
//         </form>
//       ) : (
//         <section className="space-y-4 mt-10">
//           <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">🎉 Quiz Submitted</h2>
//           <p>Total Questions: {quiz.quizQuestions.length}</p>
//           <p className="text-green-600 dark:text-green-400">Correct: {result.correct}</p>
//           <p className="text-red-600 dark:text-red-400">Incorrect: {result.incorrect}</p>
//           <p>
//             Score: <strong>{result.score}</strong> / {quiz.passingMarks}
//           </p>
//         </section>
//       )}
//     </div>
//   );
// };
return (
<div className="w-full min-h-screen p-6 md:p-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center">
  <h1 className="text-5xl md:text-7xl font-bold flex items-center gap-4">
    🚧 Work in Progress 🚧
  </h1>
</div>

  
)
}

export default AssignmentDetails;
