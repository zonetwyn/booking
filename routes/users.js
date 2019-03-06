const express = require('express');
const router = express.Router();

const authorize = require('../config/auth');
const roles = require('../config/roles');

router.get('/', authorize(roles.ROLE_ADMIN), (req, res, next) => {
    res.json({
        message: 'You made request',
        user: req.user
    })
});

module.exports = router;