const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const boardSchema = new Schema({
    name: {
        type: String
    },
    role: {
        type: String
    },
    photoUrl: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CoreFacultie', boardSchema);