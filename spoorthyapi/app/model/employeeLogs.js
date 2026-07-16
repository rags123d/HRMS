const { date } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeLogsSchema = new Schema({
    Employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    isDeleted: { type: Boolean, default: false },
    EmployeeID: String,
    EmployeeName: String,
    Gender: { type: Schema.Types.ObjectId, ref: 'Gender' },
    GrossSalary: Number,
    NetSalary: Number,
    DeductedSalary: Number,
    ClientData: { type: Schema.Types.ObjectId, ref: 'ClientData' },
    WorkOrderData: { type: Schema.Types.ObjectId, ref: 'WorkOrderRole' },
    DateOfJoining: Date,
    DateOfExit: Date,
    ReasonForExit: String,
}, {
    timestamps: true
})
module.exports = mongoose.model('EmployeeLogs', EmployeeLogsSchema)