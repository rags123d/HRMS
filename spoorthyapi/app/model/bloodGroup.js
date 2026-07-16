const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BloodGroupSchema = new Schema({
    name: String
}, {
    timestamps: true
})
module.exports = mongoose.model('BloodGroup', BloodGroupSchema)