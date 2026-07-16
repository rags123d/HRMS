const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SalaryStructureSchema = new Schema({
    name: String,
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
})
module.exports = mongoose.model('SalaryStructure', SalaryStructureSchema)