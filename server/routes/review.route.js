const express = require('express');
const reviewRouter = express.Router();
const { addReview, getReviewsForCourse, updateReview, deleteReview } = require('../controller/review.controller');
const isAuthenticated = require('../middlewares/isAuthenticated'); // Use your custom middleware
const checkRole = require('../middlewares/checkRole');

// POST /reviews/:courseId -> Add a review for a course
reviewRouter.post('/:courseId', isAuthenticated,checkRole('student'), addReview);

// GET /reviews/:courseId -> Get all reviews for a course
reviewRouter.get('/:courseId', getReviewsForCourse);

reviewRouter.delete('/:reviewId', isAuthenticated,deleteReview);


module.exports = reviewRouter;
