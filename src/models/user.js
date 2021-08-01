const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {ERROR} = require("../utils/enums");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if (!validator.isStrongPassword(value)){
                throw new Error (ERROR.strongerPassword)
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error(ERROR.invalidEmail)
            }
        }
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    weight: {
        type: Number,
        trim:true
    },
    height: {
        type: Number,
        trim:true
    },
    language: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// hiding sensitive data
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject
}

// finding users by email and password, statics - applied on a whole model
userSchema.statics.findByCredentials = async function(email, password) {
    const user = await User.findOne({email});
    if(!user) {
        throw new Error(ERROR.unableToLogin)
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error(ERROR.unableToLogin)
    }
    return user
}

// generating tokens, methods - available on instances
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

// hashing the password before saving it
userSchema.pre('save', async function(next){
    const user = this;
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;