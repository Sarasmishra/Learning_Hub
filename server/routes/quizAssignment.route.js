const express = require('express');
const { createQuizAssignment, getQuizAssignments, editQuizAssignment, deleteQuizAssignment, getAllQuizAssignmentsForInstructor, getQuizAssignmentById } = require('../controller/quizAssignment.controller');
const isAuthenticated = require('../middlewares/isAuthenticated');
const checkRole = require('../middlewares/checkRole');
const quizAssignmentRouter = express.Router();

quizAssignmentRouter.route('/:courseId')
  .post(isAuthenticated, checkRole('instructor'), createQuizAssignment);

quizAssignmentRouter.route('/:courseId')
  .get(isAuthenticated, getQuizAssignments);

quizAssignmentRouter.route('/instructor/all').get(isAuthenticated,getAllQuizAssignmentsForInstructor)
quizAssignmentRouter.route('/single/:id').get(isAuthenticated,getQuizAssignmentById)

quizAssignmentRouter.route('/:courseId/:assignmentId')
  .put(isAuthenticated, checkRole('instructor'), editQuizAssignment)
  .delete(isAuthenticated, checkRole('instructor'), deleteQuizAssignment);

module.exports = quizAssignmentRouter;
