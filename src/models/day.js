const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
    englishName: {
        type: String,
        required: true,
        trim: true
    },
    italianName: {
        type: String,
        required: true,
        trim: true
    },
    frenchName: {
        type: String,
        required: true,
        trim: true
    },
    serbianName: {
        type: String,
        required: true,
        trim: true
    },
    dutchName: {
        type: String,
        required: true,
        trim: true
    },
    planID: {
        type: String,
        required: true,
        trim: true
    },
    orderNumber: {
        type: Number,
        required: true,
        trim: true
    }
})

const Day = mongoose.model('Day', daySchema);

module.exports = Day;