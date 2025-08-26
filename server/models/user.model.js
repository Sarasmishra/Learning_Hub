const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["instructor","student"],
        required:true,
        default:"student"
    },
    enrolledCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }],
    photoUrl:{
        type:"String",
        default:""
    },
},{timestamps:true})

const userModel = mongoose.model("User",userSchema)
module.exports = userModel