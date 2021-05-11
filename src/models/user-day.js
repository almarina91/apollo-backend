const mongoose = require('mongoose');

const userDaySchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    dayID:{
        type: String,
        required: true
    }
})

// finding days connected to user and removing them
userDaySchema.statics.getUserDaysAndRemove = async function(userID){
    await UserDay.deleteMany({userID});
}

const UserDay = mongoose.model('user-day',userDaySchema);

module.exports = UserDay;