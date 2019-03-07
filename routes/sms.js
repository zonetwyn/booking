const express = require('express');
const router = express.Router();

const sendSMS = require('../config/sms');

router.post('/send', (req, res, next) => {
    const { body, to } = req.body;

    sendSMS(body, to).then(result => {
        return res.status(200).json(result);
    }).catch(error => {
        if (error.status && error.status === 400) {
            return res.status(400).json(error);
        } else {
            return res.status(500).json(error);
        }
    })
});

module.exports = router;

