const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MaritalStatusSchema = new Schema({
    name: String
}, {
    timestamps: true
})
module.exports = mongoose.model('MaritalStatus', MaritalStatusSchema)