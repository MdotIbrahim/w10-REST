const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        // maxLength: 100,
        // match: '/^.{0,20}$/'
        // validate: { min: 1, max: 10 },
    },
    isVerified: {
        type:Boolean,
        default: false,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;