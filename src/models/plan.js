const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
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
    }
})

const Plan = mongoose.model('Plan', planSchema)

module.exports = Plan;