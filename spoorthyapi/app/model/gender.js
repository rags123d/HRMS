const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenderSchema = new Schema({
    name: String
}, {
    timestamps: true
})
module.exports = mongoose.model('Gender', GenderSchema)