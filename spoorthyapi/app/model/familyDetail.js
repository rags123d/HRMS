const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilyDetailSchema = new Schema({
    Relationship: { type: Schema.Types.ObjectId, ref: 'Relationship' },
    Name: String,
    DateOfBirth: Date,
    ContactNo: String,
    AadharNo: String
    //Employee: { type: Schema.Types.ObjectId, ref: 'Employee' }
}, {
    timestamps: true
})
module.exports = mongoose.model('FamilyDetail', FamilyDetailSchema)