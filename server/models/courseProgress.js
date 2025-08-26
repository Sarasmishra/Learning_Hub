const mongoose = require('mongoose')

const lectureProgressSchema = new mongoose.Schema({
    lectureId:{type:String},
    viewed:{type:Boolean}
});

const courseProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming userId is a reference to a "User" model
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Assuming courseId is a reference to a "Course" model
    completed:{type:Boolean},
    lectureProgress:[lectureProgressSchema]
});
const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);
module.exports = CourseProgress