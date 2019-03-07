const express = require('express');
const passport =  require('passport');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const router = express.Router();

const User = require('../models/user').User;
const userValidator = require('../models/user').userValidator;

const { mailer, cons } = require('../config/mailer');

router.post('/register', async (req, res, next) => {
    const body = req.body;  
    try {

        if (!body) {
            return res.status(400).json({
                error: 'Your request body must be likes { user }'
            })
        }

        await Joi.validate(body, userValidator);

        const userEmail = await User.findOne({ 
            email: body.email 
        }).exec();
        if (userEmail) {
            return res.status(400).json({
                error: 'This email is already taken'
            })
        }
    
        const userPhone = await User.findOne({ 
            phone: body.phone 
        }).exec();
        if (userPhone) {
            return res.status(400).json({
                error: 'This phone is already taken'
            })
        }

        const hash = await bcrypt.hash(body.password, 10);
        const user = new User({
            type: body.type,
            authMethod: 'local',
            email: body.email,
            password: hash,
            name: body.name,
            phone: body.phone,
            pictureUrl: body.pictureUrl ? body.pictureUrl : ''
        });
    
        await user.save();
        cons('registration.ejs', { name: body.name }).then(html => {
            mailer(body.email, 'Account Confirmation', html).then(() => {
                return res.status(201).json({
                    message: 'Your account has been successfully created'
                });
            }).catch(error => {
                console.log('----->sending');
                console.log(error)
                return res.status(500).json({
                    error: 'Error'
                });
            });
        }).catch(error => {
            console.log('----->templating');
            console.log(error)
            return res.status(500).json({
                error: 'Error'
            });
        });

        
    } catch (error) {
        if (error.isJoi) {
            return res.status(400).json(error.details);
        } else {
            return res.status(400).json({
                error: 'Invalids arguments'
            });
        }
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('login', { session: false }, (error, user, info) => {
        if (error || !user) {
            return res.status(400).json({ 
                error: info.message ? info.message : 'Please, try again'
            });
        }

        req.login(user, { session: false }, (error) => {
            if (error) {
                res.status(400).json({ error });
            }
            const payload = { 
                _id: user._id, 
                email: user.email,
                role: user.type 
            };
            const token = jwt.sign(payload, keys.jwt.key, { expiresIn: 24 * 60 * 60 });
            return res.status(200).json({
                token: token,
                message: info.message ? info.message : ''
             })
        })
    })(req, res, next);
});

module.exports = router;

