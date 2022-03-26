const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const boardSchema = new Schema({
    name: {
        type: String
    },
    designation: {
        type: String
    },
    about: {
        type: String
    },
    photoUrl: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BoardOfGoverners', boardSchema);