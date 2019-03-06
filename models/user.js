const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const Joi = require('joi');

const enums = require('./enums');

const userSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        require: true,
        enum: enums.UserType
    },
    authMethod: {
        type: String, 
        required: true,
        enum: enums.UserAuthMethod
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    pictureUrl: {
        type: String
    }
})

userSchema.plugin(mongoosePaginate);

const userValidator = Joi.object().keys({
    type: Joi.string().valid(enums.UserType).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(6).regex(/^[a-zA-Z0-9 ]+$/).required(),
    phone: Joi.string().regex(/^\+?\d+$/).required(),
    pictureUrl: Joi.string()
});

const User = mongoose.model('User', userSchema);
module.exports = { User, userValidator }