const cloudinary = require('cloudinary').v2
require('dotenv').config()


cloudinary.config({
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
    cloud_name : process.env.CLOUD_NAME, 
})




 const uploadMedia = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });

    if(uploadResponse) return uploadResponse;
    
  } catch (error) {
    console.log(error);
  }
};



  const deleteMediaFromCloudinary = async (publicId) => {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId,{resource_type:"video"});
    } catch (error) {
        console.log(error);
        
    }
}
module.exports = {
    uploadMedia:uploadMedia,
    deleteMediaFromCloudinary:deleteMediaFromCloudinary,
    deleteVideoFromCloudinary:deleteVideoFromCloudinary
}