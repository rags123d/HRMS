const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const YearSchema = new Schema({
    Year : Number,
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
})
module.exports = mongoose.model('Year', YearSchema)