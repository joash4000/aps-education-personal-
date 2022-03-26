const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newsSchema = new Schema({
    news: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('ScrollingNews', newsSchema);