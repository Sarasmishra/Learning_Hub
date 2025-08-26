const courseModel = require("../models/course.model");
const lectureModel = require("../models/lecture.model");

const userModel = require("../models/user.model");
const {
  deleteMediaFromCloudinary,
  uploadMedia,
  deleteVideoFromCloudinary,
} = require("../utils/cloudinary");

const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: "courseTitle and category are required",
      });
    }
    const course = new courseModel({ courseTitle, category, creator: req.id });
    const savedcourse = await course.save();
    return res.status(200).json({
      savedcourse,
      message: "Course created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to create course",
    });
  }
};const searchCourse = async (req,res) => {
  try {
      const {query = "", categories = [], sortByPrice =""} = req.query;
      console.log(categories);
      
      // create search query
      const searchCriteria = {
          isPublished:true,
          $or:[
              {courseTitle: {$regex:query, $options:"i"}},
              {subTitle: {$regex:query, $options:"i"}},
              {category: {$regex:query, $options:"i"}},
          ]
      }

      // if categories selected
      if(categories.length > 0) {
          searchCriteria.category = {$in: categories};
      }

      // define sorting order
      const sortOptions = {};
      if(sortByPrice === "low"){
          sortOptions.coursePrice = 1;//sort by price in ascending
      }else if(sortByPrice === "high"){
          sortOptions.coursePrice = -1; // descending
      }

      let courses = await courseModel.find(searchCriteria).populate({path:"creator", select:"name photoUrl"}).sort(sortOptions);

      return res.status(200).json({
          success:true,
          courses: courses || []
      });

  } catch (error) {
      console.log(error);
      
  }
}



const getPublishedCourse = async (_,res) => {
    try {
        const courses = await courseModel.find({isPublished:true}).populate({path:"creator", select:"name photoUrl"});
        if(!courses){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get published courses"
        })
    }
}

const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;

    const courses = await courseModel.find({ creator: userId });

    if (!courses) {
      return res.status(404).json({
        course: [],
        message: "Course not found",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to getAll course",
    });
  }
};
const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    let course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }
    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId); // delete old image
      }
      // upload a thumbnail on clourdinary
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };

    course = await courseModel.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      course,
      message: "Course updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create course",
    });
  }
};
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }
    return res.status(200).json({
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get course by id",
    });
  }
};
const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture title is required",
      });
    }

    // create lecture
    const lecture = new lectureModel({ lectureTitle });
    const savedLecture = await lecture.save();

    const course = await courseModel.findById(courseId);
    if (course) {
      course.lectures.push(savedLecture._id);
      await course.save();
    }

    return res.status(201).json({
      lecture,
      message: "Lecture created successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create lecture",
    });
  }
};
const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await courseModel.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    return res.status(200).json({
      lectures: course.lectures,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get lectures",
    });
  }
};
const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;

    const { courseId, lectureId } = req.params;
    const lecture = await lectureModel.findById(lectureId);
    console.log(lecture)
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }
    console.log(videoInfo.videoUrl)

    // update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // Ensure the course still has the lecture id if it was not aleardy added;
    const course = await courseModel.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      lecture,
      message: "Lecture updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit lectures",
    });
  }
};
const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await lectureModel.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }
    // delete the lecture from couldinary as well
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    // Remove the lecture reference from the associated course
    await courseModel.updateOne(
      { lectures: lectureId }, // find the course that contains the lecture
      { $pull: { lectures: lectureId } } // Remove the lectures id from the lectures array
    );

    return res.status(200).json({
      message: "Lecture removed successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to remove lecture",
    });
  }
};

const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await lectureModel.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }
    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get lecture by id",
    });
  }
};

// publich unpublish course logic
const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; // true, false
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }
    // publish status based on the query paramter
    course.isPublished = publish === "true";
    await course.save();

    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      message: `Course is ${statusMessage}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update status",
    });
  }
};

module.exports = {
  createCourse: createCourse,
  editCourse: editCourse,
  getCreatorCourses: getCreatorCourses,
  getCourseById: getCourseById,
  createLecture: createLecture,
  getCourseLecture: getCourseLecture,
  editLecture: editLecture,
  removeLecture: removeLecture,
  getLectureById: getLectureById,
  togglePublishCourse: togglePublishCourse,
  getPublishedCourse:getPublishedCourse,
  searchCourse:searchCourse
};
