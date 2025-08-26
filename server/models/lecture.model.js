const mongoose = require('mongoose')

const lectureSchema = new mongoose.Schema({
  lectureTitle: {
    type: String,
    required: true,
  },
  videoUrl: { type: String },
  publicId: { type: String },
  isPreviewFree: { type: Boolean },
},{timestamps:true});
let lectureModel = mongoose.model("Lecture", lectureSchema);
module.exports = lectureModel