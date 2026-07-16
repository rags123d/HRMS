const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    Employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    Month: String,
    Year: Number,
    NoOfDaysWorked: Number,
    NoOfLeaves: Number,
    NoOfWorkingDays: Number,
    NoOfOTDays: Number,
    OTWages: Number,
    TDSAmount: Number,
    AdvanceAmount: Number,
    UniformFee: Number,
    FineAmount: Number,
    OtherDeductionAmount: Number,
    SalaryAfterDeduction: Number,
    EWBasiVDA: Number,
    EWHRA: Number,
    EWConveyance: Number,
    EWMedicalAllowance: Number,
    EWSpecialAllowance: Number,
    EWBonus: Number,
    EWLeaveWages: Number,
    EWWashingAllowance: Number,
    EWNationalFestivalHolidays: Number,
    EWPFbasedBAsicVDA: Number,
    EWPT: Number,
    EWESI: Number,
    TotalFixedWages: Number,
    TotalEarnedWages: Number,
    Deduction: Number,
    TotalNetPayable: Number
}, {
    timestamps: true
})
module.exports = mongoose.model('Attendance', AttendanceSchema)