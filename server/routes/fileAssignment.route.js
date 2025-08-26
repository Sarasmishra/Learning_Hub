const express = require('express');
const { createFileAssignment, getFileAssignments, editFileAssignment, deleteFileAssignment, getAllFileAssignmentsForInstructor, getFileAssignmentById } = require('../controller/fileAssignment.controller');
const isAuthenticated = require('../middlewares/isAuthenticated');
const checkRole = require('../middlewares/checkRole');
const fileAssignmentRouter = express.Router();

fileAssignmentRouter.route('/:courseId')
  .post(isAuthenticated, checkRole('instructor'), createFileAssignment);

fileAssignmentRouter.route('/:courseId')
  .get(isAuthenticated, getFileAssignments);

fileAssignmentRouter.route('/instructor/all').get(isAuthenticated,getAllFileAssignmentsForInstructor)
fileAssignmentRouter.route('/single/:id').get(isAuthenticated,getFileAssignmentById)

fileAssignmentRouter.route('/:courseId/:assignmentId')
  .put(isAuthenticated, checkRole('instructor'), editFileAssignment)
  .delete(isAuthenticated, checkRole('instructor'), deleteFileAssignment);

module.exports = fileAssignmentRouter;
