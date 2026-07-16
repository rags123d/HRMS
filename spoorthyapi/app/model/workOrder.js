const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");

const WorkOrderSchema = new Schema({
    name: String,
    workOrderType: String,
    mainWorkOrderId: String,
    noOfRequirements: Number,
    StartDate: Date,
    RenewalDate: Date,
    workOrderDocument: String,
    agreementDocument: String,
    bankGuaranteeDocument: String,
    depositAmount: Number,
    eprocReference: String,
    spoorthyReference: String,
    workOrderNumber: String,
    bankGuaranteeNumber: String,
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    hired: { type: Number, default: 0 },
    underapproval: { type: Number, default: 0 },
    workOrderRoles: [{ type: Schema.Types.ObjectId, ref: 'WorkOrderRole' }],
    WorkOrderId: Number,
    isDeleted: { type: Boolean, default: false },
    eprocDate: Date,
    bankGuaranteeDate: Date,
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
WorkOrderSchema.plugin(autoIncrement.plugin, {
  model: "WorkOrder", 
  field: "WorkOrderId", 
  startAt: 1, 
  incrementBy: 1, 
});
module.exports = mongoose.model('WorkOrder', WorkOrderSchema)