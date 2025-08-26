const QuizAssignment = require('../models/quizAssignment.model');  // Import QuizAssignment model
const QuizSubmission = require('../models/quizSubmission.model');  // Import QuizSubmission model
const User = require('../models/user.model');  // Import User model for student information

// Controller to handle quiz submission and grading
const submitQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId
    console.log(quizId)  // fixed here
    const { answers } = req.body;  // answers expected from frontend
console.log('Request body:', req.body);
const studentId = req.id
    const quiz = await QuizAssignment.findById(quizId).populate('quizQuestions.question');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    const submissionAnswers = answers.map(answer => {
      const question = quiz.quizQuestions.find(q => q._id.toString() === answer.questionId.toString());

      if (!question) {
        return {
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer || answer.selectedOption, // fallback if name differs
          isCorrect: false,
          correctAnswer: null,
        };
      }

      const isCorrect = question.correctAnswer === (answer.selectedAnswer || answer.selectedOption);

      if (isCorrect) score++;

      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer || answer.selectedOption,
        isCorrect,
        correctAnswer: question.correctAnswer,
      };
    });

    const submission = new QuizSubmission({
      student: studentId,
      quiz: quizId,
      attemptNumber: 1,
      score,
      answers: submissionAnswers,
      status: 'submitted',
    });

    await submission.save();

    res.status(200).json({
      message: 'Quiz submitted successfully',
      score,
      maxScore: quiz.quizQuestions.length,
      answers: submissionAnswers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting quiz', error });
  }
};

module.exports = {
  submitQuiz,  // Export the function so it can be used in routes
};
