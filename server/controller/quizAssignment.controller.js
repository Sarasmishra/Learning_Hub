const QuizAssignment = require('../models/quizAssignment.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');

// Create a Quiz Assignment
exports.createQuizAssignment = async (req, res) => {
  try {
    const courseId = req.params.courseId
    const {difficulty,title ,detailedInstruction, quizQuestions, duration, passingMarks, maxAttempts, isTimed, isActive } = req.body;
console.log("courseId -",courseId)
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const quizAssignment = new QuizAssignment({
      course: courseId,
      createdBy: req.id,  // Instructor
      difficulty,
      title,
      detailedInstruction,
      quizQuestions,
      duration,
      passingMarks,
      maxAttempts: maxAttempts || 1,  // Default to 1 if not provided
      isTimed: isTimed !== undefined ? isTimed : true,  // Default to true if not provided
      isActive: isActive !== undefined ? isActive : true,  // Default to true if not provided
    });

    await quizAssignment.save();
    res.status(201).json({ message: 'Quiz Assignment created successfully', quizAssignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all Quiz Assignments for a Course
exports.getQuizAssignments = async (req, res) => {
  try {
    const  courseId  = req.params.courseId;
    const quizAssignments = await QuizAssignment.find({ course: courseId }).populate('course').populate('createdBy')

    if (quizAssignments.length === 0) {
      return res.status(200).json({ message: 'No Quiz Assignments found for this course' });
    }

    res.status(200).json(quizAssignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all Quiz Assignments created by the instructor
exports.getAllQuizAssignmentsForInstructor = async (req, res) => {
  try {
    const instructorId = req.id; // Assuming instructor is authenticated and req.user is available

    const quizAssignments = await QuizAssignment.find({ createdBy: instructorId }).populate('course')

    res.status(200).json({ success: true, assignments: quizAssignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


exports.getQuizAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await QuizAssignment.findById(id).populate('course').populate('createdBy')

    if (!assignment) {
      return res.status(200).json({ message: 'Quiz assignment not found' });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz assignment', error });
  }
};

// Edit a Quiz Assignment
exports.editQuizAssignment = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    console.log(courseId,assignmentId)
    const { difficulty, title,detailedInstruction, quizQuestions, duration, passingMarks, maxAttempts, isTimed, isActive } = req.body;

    const quizAssignment = await QuizAssignment.findById(assignmentId);
    if (!quizAssignment) return res.status(404).json({ message: 'Assignment not found' });

    // Ensure the quiz assignment is for the given course
    if (!quizAssignment.course.equals(courseId)) {
      return res.status(400).json({ message: 'Assignment does not belong to this course' });
    }

    // Update the quiz assignment
    quizAssignment.difficulty = difficulty || quizAssignment.difficulty;
    quizAssignment.title = title || quizAssignment.title;
    quizAssignment.detailedInstruction = detailedInstruction || quizAssignment.detailedInstruction;
    quizAssignment.quizQuestions = quizQuestions || quizAssignment.quizQuestions;
    quizAssignment.duration = duration || quizAssignment.duration;
    quizAssignment.passingMarks = passingMarks || quizAssignment.passingMarks;
    quizAssignment.maxAttempts = maxAttempts || quizAssignment.maxAttempts;
    quizAssignment.isTimed = isTimed !== undefined ? isTimed : quizAssignment.isTimed;
    quizAssignment.isActive = isActive !== undefined ? isActive : quizAssignment.isActive;

    await quizAssignment.save();
    res.status(200).json({ message: 'Quiz Assignment updated successfully', quizAssignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a Quiz Assignment
exports.deleteQuizAssignment = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;

    const quizAssignment = await QuizAssignment.findById(assignmentId);
    if (!quizAssignment) return res.status(404).json({ message: 'Assignment not found' });

    // Ensure the quiz assignment is for the given course
    if (!quizAssignment.course.equals(courseId)) {
      return res.status(400).json({ message: 'Assignment does not belong to this course' });
    }

    await QuizAssignment.findByIdAndDelete(assignmentId);
    res.status(200).json({ message: 'Quiz Assignment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
