const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const Joi = require('joi');

const enums = require('./enums');

const bookingSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    departurePlace: {
        type: String,
        required: true
    },
    arrivalPlace: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        default: 'pending',
        enum: enums.BookingStatus
    },
    token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    passengers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Passenger' }]
    }
})