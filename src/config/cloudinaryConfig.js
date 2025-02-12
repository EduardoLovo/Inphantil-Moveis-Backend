if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloud Name
    api_key: process.env.CLOUDINARY_API_KEY, // API Key
    api_secret: process.env.CLOUDINARY_API_SECRET, // API Secret
});

module.exports = cloudinary;
