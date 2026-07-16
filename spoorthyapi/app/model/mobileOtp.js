var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MobileOtpSchema = new Schema({
    mobile: String,
    otp: String,
    verified: { type: Boolean, default: false },
}, {
    timestamps: true
})

module.exports = mongoose.model('MobileOtp', MobileOtpSchema);