const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizAssignmentSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Instructor
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  title: { type: String, required: true }, 
  detailedInstruction: { type: String, required: true },  // Rich Text Editor (RTE) Content
  quizQuestions: [{
    _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    question: { type: String, required: true },
    options: [{
      optionText: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }],
    correctAnswer: { type: String, required: true },  // Can be stored or validated during quiz taking
  }],
  duration: { type: Number, required: true },  // Duration of the quiz in minutes
  passingMarks: { type: Number, required: true },  // Passing marks to pass the quiz
  maxAttempts: { type: Number, default: 1 },  // Limit on how many times a student can attempt the quiz
  isTimed: { type: Boolean, default: true },  // Whether the quiz is timed or not
  isActive: { type: Boolean, default: true },  // Whether the quiz is active or not
}, { timestamps: true });

const QuizAssignment = mongoose.model('QuizAssignment', quizAssignmentSchema);
module.exports = QuizAssignment;
