const express= require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { getCourseProgress, updateLectureProgress, markAsCompleted, markAsInCompleted } = require('../controller/courseProgress.controller');
const checkRole = require('../middlewares/checkRole');
const router = express.Router()

router.route("/:courseId").get(isAuthenticated,checkRole('student') ,getCourseProgress);
router.route("/:courseId/lecture/:lectureId/view").post(isAuthenticated,checkRole('student') ,updateLectureProgress);
router.route("/:courseId/complete").post(isAuthenticated, checkRole('student'),markAsCompleted);
router.route("/:courseId/incomplete").post(isAuthenticated, checkRole('student'),markAsInCompleted);

module.exports = router