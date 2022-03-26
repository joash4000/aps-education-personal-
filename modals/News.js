const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const boardSchema = new Schema({
    heading: {
        type: String
    },
    news: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('News', boardSchema);