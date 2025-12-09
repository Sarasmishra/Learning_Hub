// src/pages/student/AssignmentDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import DOMPurify from "dompurify";

import { useFetchQuizAssignmentByIdQuery } from "@/features/api/quizAssignmentApi";
import { useSubmitQuizMutation } from "@/features/api/submissionApi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * Robust AssignmentDetails (defensive against missing fields)
 */

const AssignmentDetails = () => {
  const { assignmentId } = useParams();

  const { data: quiz, isLoading, error } = useFetchQuizAssignmentByIdQuery(assignmentId);
  const [submitQuiz, { isLoading: submitting }] = useSubmitQuizMutation();

  // defensive local copies
  const questions = Array.isArray(quiz?.quizQuestions) ? quiz.quizQuestions : [];
  const durationMinutes = typeof quiz?.duration === "number" ? quiz.duration : null;

  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes !== null ? durationMinutes * 60 : null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // initialize timeLeft if quiz loads later
  useEffect(() => {
    if (durationMinutes !== null) {
      setTimeLeft(durationMinutes * 60);
    } else {
      setTimeLeft(null);
    }
  }, [durationMinutes]);

  // countdown
  useEffect(() => {
    if (timeLeft === null || isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, isSubmitted]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = () => {
    if (timeLeft === null) return "--:--";
    const m = Math.floor(timeLeft / 60);
    const s = String(timeLeft % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;

    // build payload safely using `questions` (never undefined)
    const payload = {
      assignmentId,
      answers: questions.map((q) => ({
        questionId: q._id,
        selectedOption: answers[q._id] ?? "",
      })),
    };

    try {
      const res = await submitQuiz(payload).unwrap?.() ?? await submitQuiz(payload);
      // some APIs return nested data; handle generically
      const responseData = res?.data ?? res ?? {};
      setIsSubmitted(true);
      setResult(responseData);
      toast.success("Quiz submitted!");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit quiz.");
    }
  };

  if (isLoading) return <p className="text-center mt-10 text-lg">Loading quiz...</p>;
  if (error || !quiz) return <p className="text-center text-red-500 mt-10">Failed to load quiz assignment.</p>;

  // sanitize instructions (safe even if missing)
  const safeInstructions = DOMPurify.sanitize(quiz?.detailedInstruction || "<p>No instructions provided.</p>");

  // If there are no questions, show friendly message and still show info
  if (questions.length === 0 && !isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-3">Quiz: {quiz?.title || "Untitled"}</h2>
          <div className="mb-4">
            <div className="text-sm">Instructor: <strong>{quiz?.createdBy?.name ?? "N/A"}</strong></div>
            <div className="text-sm">Duration: {durationMinutes !== null ? `${durationMinutes} mins` : "Not set"}</div>
            <div className="text-sm">Passing Marks: {quiz?.passingMarks ?? "N/A"}</div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded mb-4">
            <div dangerouslySetInnerHTML={{ __html: safeInstructions }} />
          </div>

          <div className="text-center text-slate-600">This quiz currently has no questions.</div>
        </Card>
      </div>
    );
  }

  // Submitted UI — be defensive: result may be partial
  if (isSubmitted) {
    const correct = result?.correct ?? result?.data?.correct ?? "N/A";
    const incorrect = result?.incorrect ?? result?.data?.incorrect ?? "N/A";
    const score = result?.score ?? result?.data?.score ?? "N/A";

    return (
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <Card className="p-6">
          <h2 className="text-3xl font-bold mb-3 text-green-600">🎉 Quiz Submitted</h2>
          <p>Total Questions: {questions.length}</p>
          <p className="text-green-600">Correct: {correct}</p>
          <p className="text-red-600">Incorrect: {incorrect}</p>
          <p className="mt-3">Score: <strong>{score}</strong></p>
          <Separator className="my-4" />
          <Button onClick={() => window.location.reload()} className="w-full">Retry</Button>
        </Card>
      </div>
    );
  }

  // MAIN QUIZ UI
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">{quiz?.title || "Quiz"}</h2>
        <p className="text-sm text-gray-600 mt-2">
          Instructor: <strong>{quiz?.createdBy?.name ?? "N/A"}</strong>
        </p>
        <div className="mt-4 flex flex-wrap gap-4 bg-gray-100 dark:bg-gray-800 p-3 rounded">
          <div><strong>Total:</strong> {questions.length}</div>
          <div><strong>Duration:</strong> {durationMinutes !== null ? `${durationMinutes} mins` : "N/A"}</div>
          <div className="text-red-600"><strong>Time Left:</strong> {formatTime()}</div>
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded" dangerouslySetInnerHTML={{ __html: safeInstructions }} />

      {/* Questions */}
      <div className="space-y-8">
        {questions.map((q, idx) => (
          <Card key={q._id} className="p-5">
            <div className="text-lg font-medium">Q{idx + 1}. {q.question}</div>
            <div className="mt-4 space-y-2">
              {Array.isArray(q.options) && q.options.length > 0 ? (
                q.options.map((opt) => {
                  const optionText = opt.optionText ?? opt; // handle different option shapes
                  const isSelected = answers[q._id] === optionText;
                  return (
                    <label
                      key={opt._id ?? optionText}
                      className={`block p-3 border rounded cursor-pointer transition ${
                        isSelected ? "bg-blue-100 dark:bg-blue-900 border-blue-500" : "border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q._id}
                        value={optionText}
                        checked={isSelected}
                        onChange={() => handleSelect(q._id, optionText)}
                        className="hidden"
                      />
                      {optionText}
                    </label>
                  );
                })
              ) : (
                <div className="text-sm text-slate-500">No options available for this question.</div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmit} disabled={submitting} className="w-full mt-8 text-lg">
        {submitting ? "Submitting..." : "Submit Quiz"}
      </Button>
    </div>
  );
};

export default AssignmentDetails;
