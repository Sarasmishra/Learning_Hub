const express = require('express');
const { submitFileAssignment, gradeSubmission } = require('../controller/submission.controller');
const isAuthenticated = require('../middlewares/isAuthenticated');
const checkRole = require('../middlewares/checkRole');
const submissionRouter = express.Router();
const cloudinary = require('../utils/cloudinary'); 
const upload = require('../utils/multer');
const { submitQuiz } = require('../controller/quizSubmission.controller');

// Student submits file assignment
submissionRouter.route('/file/:assignmentId/submit').post(
    isAuthenticated,
    checkRole("student"),
    upload.single("file"),
    submitFileAssignment
  );
submissionRouter.route('/quiz/:quizId/submit').post(isAuthenticated,submitQuiz)
// Instructor grades the submission
submissionRouter.route('/:submissionId/grade')
  .put(isAuthenticated, checkRole('instructor'), gradeSubmission);

module.exports = submissionRouter;


