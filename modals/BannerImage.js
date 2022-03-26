const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const boardSchema = new Schema({
    altText: {
        type: String
    },
    imageUrl: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BannerImage', boardSchema);