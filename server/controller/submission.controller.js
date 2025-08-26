const Submission = require('../models/submission.model');
const FileAssignment = require('../models/fileAssignment.model');

// Create a Submission for a File Assignment
exports.submitFileAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { fileUrl } = req.body;

    const fileAssignment = await FileAssignment.findById(assignmentId);
    if (!fileAssignment) return res.status(404).json({ message: 'Assignment not found' });

    const submission = new Submission({
      student: req.user._id,  // The student who is submitting
      fileUrl,
      submissionDate: new Date(),
    });

    await submission.save();
    res.status(201).json({ message: 'Assignment submitted successfully', submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



// Grade a Submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade } = req.body;

    const submission = await Submission.findById(submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.grade = grade;
    await submission.save();

    res.status(200).json({ message: 'Submission graded successfully', submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
