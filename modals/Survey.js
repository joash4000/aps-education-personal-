const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const surveySchema = new Schema({
    courses: {
        type: Array
    },
    college: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    fatherName: {
        type: String
    },
    dob: {
        type: Date
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String
    },
    state: {
        type: String
    },
    district: {
        type: String
    },
    tehsil: {
        type: String
    },
    pincode: {
        type: Number
    },
    contact: {
        type: Number,
        required: true,
        unique: true
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    bloodGroup: {
        type: String
    },
    board10: {
        type: String,
    },
    year10: {
        type: String
    },
    board12: {
        type: String,
    },
    year12: {
        type: String
    },
    graduationYear: {
        type: String
    },
    graduationUniversity: {
        type: String
    },
    graduationCourse: {
        type: String
    },
    coaching: {
        type: String
    },
    forceMember: {
        type: String
    },
    governmentMember: {
        type: String
    },
    other: {
        type: String
    },
    studentPhotoUrl: {
        type: String
    },
    mode: {
        type: String,
        default: "Web"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Survey', surveySchema);