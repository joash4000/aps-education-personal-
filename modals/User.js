const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    role: {
        type: String,
        required: true
    },
    confirmedAt: {
        required: true,
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);