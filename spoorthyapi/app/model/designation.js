const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DesignationSchema = new Schema({
    name: String,
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
})
module.exports = mongoose.model('Designation', DesignationSchema)