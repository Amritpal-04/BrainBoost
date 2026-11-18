const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    phoneCountry: {
        type: String,
        required: true,
    },
    educationLevel: {
        type: String,
        enum: ['primary', 'middle', 'high', 'college', 'other'],
    },
    learningGoal: {
        type: String,
        enum: ['math', 'logic', 'calculation', 'confidence', 'other'],
    },
    password: {
        type: String,
        required: true,
    }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;