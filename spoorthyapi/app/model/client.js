const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");

const ClientSchema = new Schema({
    name: String,
    address: String,
    officePhoneNo: String,
    contactPerson: String,
    designation : { type: Schema.Types.ObjectId, ref: 'Designation' },
    cantactNo: String,
    email: String,
    GSTIN: String,
    PAN: String,
    TAN: String,
    pinCode: Number,
    contactEmail: String,
    workorderCount: { type: Number, default: 0 },
    employeeRequirement: { type: Number, default: 0 },
    hired: { type: Number, default: 0 },
    companyLogo: String,
    agreementDocument: String,
    licenseDocument: String,
    GSTDocument : String,
    PANDocument: String,
    TANDocument: String,
    ClientId: Number,
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
ClientSchema.plugin(autoIncrement.plugin, {
  model: "Client", 
  field: "ClientId", 
  startAt: 1, 
  incrementBy: 1, 
});
module.exports = mongoose.model('Client', ClientSchema)