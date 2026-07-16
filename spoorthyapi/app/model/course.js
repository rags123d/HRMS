const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: String,
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
})
module.exports = mongoose.model('Course', CourseSchema)