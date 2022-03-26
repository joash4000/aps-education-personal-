const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const videoCapsule = new Schema({
    link: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('EcapsuleHinid', videoCapsule);