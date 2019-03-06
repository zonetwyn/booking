const express = require('express');
const router = express.Router();
const multer = require('multer');
const DataUri = require('datauri');
const path = require('path');

const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();
const uploads = multer({ storage }).single('image');
const dataUri = req => new DataUri().format(path.extname(req.file.originalname).toString(), req.file.buffer);

router.post('/upload', uploads, (req, res, next) => {
    const { folder, update, userId } = req.body;
    if (req.file) {
        const file = dataUri(req).content;
        return cloudinary.uploader.upload(file, { folder: folder }).then(result => {
            const image = result.url;
            return res.status(200).json({
                message: 'Your image has been uploded successfully to cloudinary',
                data: {
                    image
                }
            });
        }).catch(error => {
            res.status(400).json({
                message: 'Seems like something went wrong while processing your request',
                data: {
                    error
                }
            })
        })
    }
})

module.exports = router;