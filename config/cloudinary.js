const cloudinary = require('cloudinary').v2;
const keys = require('../config/keys');

cloudinary.config({
    cloud_name: keys.cloudinary.cloudName,
    api_key: keys.cloudinary.apiKey,
    api_secret: keys.cloudinary.apiSecret
})

module.exports = cloudinary;