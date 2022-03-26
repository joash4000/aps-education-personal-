const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const collegeSchema = new Schema({
    collegeName: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('College', collegeSchema);