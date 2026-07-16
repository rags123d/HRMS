const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReferencesSchema = new Schema({
    Name: String,
    Occupation: String,
    Address: String,
    ContactNo: String,
    AadharNo: String
    //Employee: { type: Schema.Types.ObjectId, ref: 'Employee' }
}, {
    timestamps: true
})
module.exports = mongoose.model('References', ReferencesSchema)