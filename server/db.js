const mongoose = require('mongoose')

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongoose connected")
    } catch (error) {
        console.log("ERROR",error)
    }
}
module.exports=connectDb()