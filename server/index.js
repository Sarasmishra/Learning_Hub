const express = require('express')
require('dotenv').config()
const connectDb  = require('./db')
const userRouter = require('./routes/user.route')
const cookie_parser = require('cookie-parser')
const mediaRouter = require('./routes/media.route')
const courseProgressRoute = require('./routes/courseProgress.route')

const app = express()
const cors = require('cors')
const courseRouter = require('./routes/course.route')
const purchaseRouter = require('./routes/purchaseCourse.route')
const { stripeWebhook } = require('./controller/coursePurchase.controller')
const PORT = process.env.PORT 
const bodyParser = require('body-parser')
const reviewRouter = require('./routes/review.route')
const quizAssignmentRouter = require('./routes/quizAssignment.route')
const fileAssignmentRouter = require('./routes/fileAssignment.route')
const submissionRouter = require('./routes/submission.route')

// apis
// For Stripe Webhook (must come first)
app.post(
    '/api/v1/purchase/webhook',
    bodyParser.raw({ type: 'application/json' }),
    (req, res, next) => {
      req.rawBody = req.body; // 👈️ Save raw body manually
      next();
    },
    stripeWebhook
  );



app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true
}));
app.use(cookie_parser())

app.use('/api/v1/user',userRouter);
app.use('/api/v1/course',courseRouter)
app.use("/api/v1/media",mediaRouter)
app.use("/api/v1/purchase",purchaseRouter)
app.use("/api/v1/review",reviewRouter)

app.use("/api/v1/progress", courseProgressRoute);
app.use("/api/v1/quiz-assignments", quizAssignmentRouter);
app.use("/api/v1/file-assignments", fileAssignmentRouter);
app.use("/api/v1/submissions", submissionRouter);



app.listen(PORT,async()=>{
    await connectDb
    console.log(`server started at PORT - ${PORT}`)
})
