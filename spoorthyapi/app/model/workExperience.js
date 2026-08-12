const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkExperienceSchema = new Schema({
    // Designation : { type: Schema.Types.ObjectId, ref: 'Designation' },
    Designation : String,
    CompanyName: String,
    From: String,
    To: String,
    ExperienceYear: String,
    SalaryDrawn : Number,
    ReasonForLeaving : String,
    SupervisorName : String,
    SupervisorMobile : Number,
    SupervisorEmail : String,
    WorkExperienceLetter : String,
    WorkExperienceType : String,
    ESIBasedOn : String,

    //Employee: { type: Schema.Types.ObjectId, ref: 'Employee' }
}, {
    timestamps: true
})
module.exports = mongoose.model('WorkExperience', WorkExperienceSchema)