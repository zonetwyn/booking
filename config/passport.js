const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');

const User = require('../models/user').User;
const keys = require('../config/keys');

passport.use('login', 
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({
                email: email
            }).exec();
            if (!user) {
                console.log('User not found');
                return done(null, false, { 
                    message : 'User not found'
                });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return done(null, false, { 
                    message : 'Invalid password'
                });
            }

            return done(null, user, 
                { message : 'You have been successfully logged in'
            });
        } catch (error) {
            done(error);
        }
    })
);

passport.use(
    new JWTStrategy({
        secretOrKey : keys.jwt.key,
        jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken()
    }, (payload, done) => {
        User.findById(payload._id).then(user => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }).catch(error => {
            return done(error, false);
        });
    })
);

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});