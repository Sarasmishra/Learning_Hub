const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileAssignmentSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Instructor
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  title: { type: String, required: true }, 
  detailedInstruction: { type: String, required: true },  // Rich Text Editor (RTE) Content
  submission: { type: Schema.Types.ObjectId, ref: 'Submission' },  // Will link to Submission Schema
  deadline: { type: Date, required: true },  // New field for assignment deadline
  gradingCriteria: { type: String },  // New field for grading criteria
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const FileAssignment = mongoose.model('FileAssignment', fileAssignmentSchema);
module.exports = FileAssignment;
