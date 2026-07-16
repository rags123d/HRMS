const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkOrderRoleSchema = new Schema({
    role: { type: Schema.Types.ObjectId, ref: 'Designation' },
    noOfManpower: Number,
    branchName : String,
    siteAddress: String,
    salary: Number,
    hired: { type: Number, default: 0 },
    underapproval: { type: Number, default: 0 },
}, {
    timestamps: true
})
module.exports = mongoose.model('WorkOrderRole', WorkOrderRoleSchema)