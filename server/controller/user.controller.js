const express = require('express')
const userModel = require('../models/user.model')
const userRouter = express.Router()
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')
const generateToken = require('../utils/generateToken')
const { uploadMedia, deleteMediaFromCloudinary } = require('../utils/cloudinary')

require('dotenv').config()



const register = async(req,res)=>{
    try{
        const {name,email,password} = req.body
        if(!name || !email || !password){
            return  res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        let user = await userModel.findOne({email})
        if(user){
            return res.status(400).send("User already exist!")
        }
        const hashpassword = await bcrypt.hash(password,6)
        user = new userModel({name,email,password:hashpassword})
        const saveduser = await user.save()
        res.status(201).json({message:"User registered successfully"})
    }catch(err){
        return res.status(400).json({message:"falied to Signup"})
    }
} 



// login route
const login = async(req,res)=>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send("User not found!")
        }
        const isValidPassword = await bcrypt.compare(password,user.password)
        if(!isValidPassword){
            return res.status(400).send("Password is wrong!")

        }
        generateToken(res,user,`Welcome back ${user.name}`);
        res.status(200)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
}


const logout = async  (req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out succesfully",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to logout"
        }) 
    }
}

const getUserProfile = async (req,res) => {
    try {
        const userId = req.id
console.log(userId)
 
        const user = await userModel.findById(userId).select('-password').populate('enrolledCourses')
    if(!user){
        return res.status(404).json({
            message:"Profile not found",
            success:false
        })
    }
    return res.status(200).json({
        success:true,
        user
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to load user"
        }) 
    }
}
const updateProfile = async (req,res) => {
    try {
        const userId = req.id;
        const {name} = req.body;
        const profilePhoto = req.file;

        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            }) 
        }
        // extract public id of the old image from the url is it exists;
        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract public id
            deleteMediaFromCloudinary(publicId);
        }

        // upload new photo
        const cloudResponse = await uploadMedia(profilePhoto.path);
        const photoUrl = cloudResponse.secure_url;

        const updatedData = {name, photoUrl};
        const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");

        return res.status(200).json({
            success:true,
            user:updatedUser,
            message:"Profile updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to update profile"
        })
    }
}

// myModule.js
module.exports = {
    register: register,
    login: login,
    logout:logout,
    getUserProfile:getUserProfile,
    updateProfile:updateProfile
  };
  
