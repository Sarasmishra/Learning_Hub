const Stripe = require("stripe");
const courseModel = require("../models/course.model");
const CoursePurchaseModel = require("../models/coursePurchase.model");
const userModel = require("../models/user.model");
const lectureModel = require("../models/lecture.model");
require('dotenv').config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;
    console.log("req body-",req.body)

    const course = await courseModel.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    // Create a new course purchase record
    const newPurchase = new CoursePurchaseModel({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/course-progress/${courseId}`, // once payment successful redirect to course progress page
      cancel_url: `http://localhost:5173/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], // Optionally restrict allowed countries
      },
    });
    if (!session.url) {
        return res
          .status(400)
          .json({ success: false, message: "Error while creating session" });
      }
  
      // Save the purchase record
      newPurchase.paymentId = session.id;
      await newPurchase.save();
      console.log("✅ Stripe Session URL: ", session.url);
  
      return res.status(200).json({
        success: true,
        url: session.url, // Return the Stripe checkout URL
      });
  } catch (error) {
    console.log(error);
  }
};
const stripeWebhook = async (req, res) => {
  console.log("✅ Stripe Webhook Triggered");

  let event;

  try {
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
    const sig = req.headers['stripe-signature'];

    // Log raw body for debugging (remove after confirming)
    console.log("Raw Body:", req.rawBody);

    event = stripe.webhooks.constructEvent(req.rawBody, sig, secret);  // Use raw body

  } catch (error) {
    console.error("Webhook signature verification failed:", error.stack);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("✅ Checkout Session Completed Webhook Triggered");

    try {
      const session = event.data.object;
      console.log("👉 Stripe Session ID:", session.id);

      const purchase = await CoursePurchaseModel.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });
      console.log("🎯 Found Purchase:", purchase);

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100; // Convert to correct currency format
      }
      purchase.status = "completed";

      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await lectureModel.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      await userModel.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      await courseModel.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );

    } catch (error) {
      console.error("Error processing webhook:", error.stack);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.status(200).send(); // Acknowledge receipt
};


// unreal-wowed-poised-flashy

const getCourseDetailWithPurchaseStatus = async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.id;
  
      const course = await courseModel.findById(courseId)
        .populate({ path: "creator" })
        .populate({ path: "lectures" });
  
      const purchased = await CoursePurchaseModel.findOne({ userId, courseId });
      console.log(purchased);
  
      if (!course) {
        return res.status(404).json({ message: "course not found!" });
      }
  
      return res.status(200).json({
        course,
        purchased: purchased ? purchased.status === 'completed' : false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllPurchasedCourse = async (_, res) => {
    try {
      const purchasedCourse = await CoursePurchaseModel.find({
        status: "completed",
      }).populate({
        path: "courseId",
        populate: {
          path: "creator",
        },
      });
      if (!purchasedCourse) {
        return res.status(404).json({
          purchasedCourse: [],
        });
      }
      return res.status(200).json({
        purchasedCourse,
      });
    } catch (error) {
      console.log(error);
    }
  };

module.exports ={
    createCheckoutSession,stripeWebhook,getCourseDetailWithPurchaseStatus,getAllPurchasedCourse
}