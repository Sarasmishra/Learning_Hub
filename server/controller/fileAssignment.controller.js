const FileAssignment = require('../models/fileAssignment.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Submission = require('../models/submission.model');

// Create a File Assignment
exports.createFileAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { difficulty,title, detailedInstruction, deadline, gradingCriteria, isActive } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const fileAssignment = new FileAssignment({
      course: courseId,
      createdBy: req.id,  // Instructor
      difficulty,
      title,
      detailedInstruction,
      deadline,
      gradingCriteria,
      isActive: isActive || true, // Default to true if not provided
    });

    await fileAssignment.save();
    res.status(201).json({ message: 'File Assignment created successfully', fileAssignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all File Assignments for a Course
exports.getFileAssignments = async (req, res) => {
  try {
    const  courseId  = req.params.courseId;
    const fileAssignments = await FileAssignment.find({ course: courseId }).populate('course')

    if (fileAssignments.length === 0) {
      return res.status(200).json({ message: 'No File Assignments found for this course' });
    }

    res.status(200).json(fileAssignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// Get all File Assignments created by the instructor
exports.getAllFileAssignmentsForInstructor = async (req, res) => {
  try {
    const instructorId = req.id; // Assuming instructor is authenticated and req.user is available

    const fileAssignments = await FileAssignment.find({ createdBy: instructorId }).populate('course')

    res.status(200).json({ success: true, assignments: fileAssignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getFileAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await FileAssignment.findById(id).populate('course')

    if (!assignment) {
      return res.status(200).json({ message: 'File assignment not found' });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching file assignment', error });
  }
};


// Edit a File Assignment
exports.editFileAssignment = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    const { difficulty,title ,detailedInstruction, deadline, gradingCriteria, isActive } = req.body;

    const fileAssignment = await FileAssignment.findById(assignmentId);
    if (!fileAssignment) return res.status(404).json({ message: 'Assignment not found' });

    // Ensure the file assignment is for the given course
    if (!fileAssignment.course.equals(courseId)) {
      return res.status(400).json({ message: 'Assignment does not belong to this course' });
    }

    // Update the file assignment
    fileAssignment.difficulty = difficulty || fileAssignment.difficulty;
    fileAssignment.title = title || fileAssignment.title
    fileAssignment.detailedInstruction = detailedInstruction || fileAssignment.detailedInstruction;
    fileAssignment.deadline = deadline || fileAssignment.deadline;
    fileAssignment.gradingCriteria = gradingCriteria || fileAssignment.gradingCriteria;
    fileAssignment.isActive = isActive !== undefined ? isActive : fileAssignment.isActive; // Default to current value if not provided

    await fileAssignment.save();
    res.status(200).json({ message: 'File Assignment updated successfully', fileAssignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a File Assignment
exports.deleteFileAssignment = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;

    const fileAssignment = await FileAssignment.findById(assignmentId);
    if (!fileAssignment) return res.status(404).json({ message: 'Assignment not found' });

    // Ensure the file assignment is for the given course
    if (!fileAssignment.course.equals(courseId)) {
      return res.status(400).json({ message: 'Assignment does not belong to this course' });
    }

    await FileAssignment.findByIdAndDelete(assignmentId);
    res.status(200).json({ message: 'File Assignment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
