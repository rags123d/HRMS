const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EducationalQualificationSchema = new Schema({
    Course: { type: Schema.Types.ObjectId, ref: 'Course' },
    SchoolCollegeName : String,
    From: String,
    To: String,
    Marks: String,
    //Employee: { type: Schema.Types.ObjectId, ref: 'Employee' }
}, {
    timestamps: true
})
module.exports = mongoose.model('EducationalQualification', EducationalQualificationSchema)