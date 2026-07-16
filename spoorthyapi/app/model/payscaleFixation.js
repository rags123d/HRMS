const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PayscaleFixationSchema = new Schema({
    isDeleted: { type: Boolean, default: false },
    WorkOrder: { type: Schema.Types.ObjectId, ref: 'WorkOrder' },
    WorkOrderRole: { type: Schema.Types.ObjectId, ref: 'WorkOrderRole' },
    ESIBasedOn: String,

    GrossSalary: Number,
    NetSalary: Number,
    DeductedSalary: Number,
    
    benefitType: String,
    BasicVDA: Number,
    Gratuity: Number,
    MedicalAllowance: Number,
    RelieverCharges: Number,
    Bonus: Number,
    HRA: Number,
    NationalFestivalHolidays: Number,
    Conveyance: Number,
    LeaveWithWages: Number,
    WashingAllowance: Number,
    SpecialAllowance: Number,
  
    deductionType: String,
    PFAmount: Number,
    ESIAmount: Number,
    ProfessionalTax: Number,

}, {
    timestamps: true
})
module.exports = mongoose.model('PayscaleFixation', PayscaleFixationSchema)