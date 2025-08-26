const Review = require('../models/review.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');

// 1. Add a review
const addReview = async (req, res) => {
  try {
    const  {courseId}  = req.params;
    const {  rating, comment } = req.body;
    const userId = req.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user has already reviewed this course
    const existingReview = await Review.findOne({ user: userId, course: courseId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this course" });
    }

    // Create a new review
    const newReview = new Review({
      user: userId,
      course: courseId,
      rating,
      comment
    });

    // Save the review
    await newReview.save();
    console.log("course.reviews before push:", course.reviews);


    // Add the review to the course model
    await Course.findByIdAndUpdate(courseId, {
        $push: { reviews: newReview._id }
      });
      
    // Return the created review
    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Get all reviews for a course
const getReviewsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId)
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'name photoUrl',
      }
    });
    console.log("reviews - ",course)
  
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Return reviews
    res.status(200).json(course.reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find the review by ID
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    // Send a success response
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting the review' });
  }
};


module.exports = {
  addReview,
  getReviewsForCourse,
  deleteReview
};
