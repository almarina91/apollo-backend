const mongoose = require('mongoose');

const intervalSchema = new mongoose.Schema({
    seconds: {
        type: Number,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    planID: {
        type: String,
        required: true,
        trim: true
    },
    dayID: {
        type: String,
        required: true,
        trim: true
    },
    orderNumber : {
        type: Number,
        required: true,
        trim: true
    }
})

const Interval = mongoose.model('Interval', intervalSchema);

module.exports = Interval;