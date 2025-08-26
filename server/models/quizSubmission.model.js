const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quizSubmissionSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: Schema.Types.ObjectId, ref: 'QuizAssignment', required: true },
    attemptNumber: { type: Number, required: true },
    score: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
    answers: [{
      questionId: { type: Schema.Types.ObjectId, required: true },
      selectedAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
      correctAnswer: { type: String, required: true }
    }]
  }, { timestamps: true });
  

  const QuizSubmission = mongoose.model('QuizSubmission', quizSubmissionSchema);
module.exports = QuizSubmission;