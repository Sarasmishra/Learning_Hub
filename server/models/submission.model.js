const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },  // URL to the submitted file
  submissionDate: { type: Date, required: true },
  grade: { type: String, enum: ['A', 'B', 'C', 'D', 'F'], default: 'Not Graded' },  // Initially 'Not Graded'
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
