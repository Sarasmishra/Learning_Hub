const express = require('express')
const userRouter = express.Router()
const {register,login, getUserProfile, logout, updateProfile} = require('../controller/user.controller.js')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const upload = require('../utils/multer.js')
// const login = require('../controller/user.controller.js')



userRouter.route('/register').post(register)
userRouter.route('/login').post(login)
userRouter.route('/logout').get(logout)
userRouter.route('/profile').get(isAuthenticated,getUserProfile)
userRouter.route('/profile/update').put(isAuthenticated,upload.single('profilePhoto'),updateProfile)



module.exports = userRouter 