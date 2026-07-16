const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    BillId: { type: Schema.Types.ObjectId, ref: 'Bill' },
    PaymentMode: { type: Schema.Types.ObjectId, ref: 'PaymentMode' },
    UTR: String,
    AmountReceived: Number,
    PaymentReceivedOn: Date,
    Remarks: String,
    VerifiedBy: String,
}, {
    timestamps: true
})
module.exports = mongoose.model('Payment', PaymentSchema)