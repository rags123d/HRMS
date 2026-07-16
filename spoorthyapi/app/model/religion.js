const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReligionSchema = new Schema({
    name: String,
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
})
module.exports = mongoose.model('Religion', ReligionSchema)