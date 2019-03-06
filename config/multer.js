const multer = require('multer');
const DataUri = require('datauri');
const path = require('path');
/*const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdir('./uploads', (err) => {
            if (err) {
                console.log(err.stack);
            } else {
                cb(null, 'uploads/');
            }
        })
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});*/