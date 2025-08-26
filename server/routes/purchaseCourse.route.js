const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { createCheckoutSession, stripeWebhook, getCourseDetailWithPurchaseStatus, getAllPurchasedCourse } = require('../controller/coursePurchase.controller');

const purchaseRouter = express.Router()

purchaseRouter.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);

purchaseRouter.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus);
purchaseRouter.route("/").get(isAuthenticated,getAllPurchasedCourse);

module.exports =purchaseRouter