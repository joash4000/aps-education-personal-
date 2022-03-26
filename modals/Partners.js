const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const boardSchema = new Schema({
    name: {
        type: String
    },
    type: {
        type: String
    },
    link: {
        type: String
    },
    photoUrl: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('partners', boardSchema);