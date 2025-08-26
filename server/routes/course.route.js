const express =require('express')
const { createCourse, getCreatorCourses, editCourse, getCourseById, createLecture, getCourseLecture, editLecture, removeLecture, getLectureById, togglePublishCourse, getPublishedCourse, searchCourse } = require('../controller/course.controller')
const isAuthenticated = require('../middlewares/isAuthenticated')
const upload = require('../utils/multer')
const checkRole = require('../middlewares/checkRole')
const courseRouter = express.Router()

courseRouter.route("/").post(isAuthenticated,checkRole("instructor"),createCourse)
courseRouter.route("/search").get(isAuthenticated,searchCourse)
courseRouter.route("/published-courses").get(isAuthenticated,getPublishedCourse)
courseRouter.route("/").get(isAuthenticated,getCreatorCourses)
courseRouter.route("/:courseId").put(isAuthenticated,checkRole("instructor"),upload.single("courseThumbnail"),editCourse)
courseRouter.route("/:courseId").get(isAuthenticated,getCourseById)
courseRouter.route("/:courseId/lecture").post(isAuthenticated,checkRole("instructor"),createLecture)
courseRouter.route("/:courseId/lecture").get(isAuthenticated,getCourseLecture)

courseRouter.route("/:courseId/lecture/:lectureId").put(isAuthenticated,checkRole("instructor"),editLecture)
courseRouter.route("/lecture/:lectureId").delete(isAuthenticated,checkRole("instructor"),removeLecture)
courseRouter.route("/lecture/:lectureId").get(isAuthenticated,getLectureById)
courseRouter.route("/:courseId").patch(isAuthenticated,checkRole("instructor"),togglePublishCourse)




module.exports = courseRouter