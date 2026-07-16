const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentModeSchema = new Schema({
    name: String
}, {
    timestamps: true
})
module.exports = mongoose.model('PaymentMode', PaymentModeSchema)