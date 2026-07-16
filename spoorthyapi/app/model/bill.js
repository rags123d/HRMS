const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");

const BillSchema = new Schema(
  {
    WorkOrder: { type: Schema.Types.ObjectId, ref: "WorkOrder" },
    Client: { type: Schema.Types.ObjectId, ref: "Client" },
    Employees: [
      {
        Employee: { type: Schema.Types.ObjectId, ref: "Employee" },
        NoOfDaysWorked: Number,
        NoOfLeaves: Number,
        TDSAmount: Number,
        AdvanceAmount: Number,
        UniformFee: Number,
        FineAmount: Number,
        OtherDeductionAmount: Number,
        SalaryAfterDeduction: Number,
        IsOTEmp: { type: Boolean, default: false },
        OTBasedOn: String,
        NoOfOTDays: Number,
        OTWages: Number,
      },
    ],
    Month: String,
    Year: Number,
    DueDate: Date,
    GrossAmount: Number,
    TotalAmount: Number,
    TotalBillAmount: Number,
    CGST: { type: Number, default: 0 },
    SGST: { type: Number, default: 0 },
    IGST: { type: Number, default: 0 },
    TDS: { type: Number, default: 0 },
    TDSCGST: { type: Number, default: 0 },
    TDSSGST: { type: Number, default: 0 },
    AmountReceived: { type: Number, default: 0 },
    CGSTAmount: { type: Number, default: 0 },
    SGSTAmount: { type: Number, default: 0 },
    OverAllHired: { type: Number, default: 0 },
    OverAllManDays: { type: Number, default: 0 },
    OverAllManDaysBA: { type: Number, default: 0 },
    BillStatus: { type: String, default: "NOT PAID" },
    Payments: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
    isDeleted: { type: Boolean, default: false },
    isGenerated: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    GeneratedOn: Date,
    LastPaidOn: Date,
    InvoiceURL: String,
    billAbstract: [
      {
        WorkOrderRole: { type: Schema.Types.ObjectId, ref: "WorkOrderRole" },
        WOBranch: String,
        WorkOrderRoleName: String,
        WorkOrderRoleNameId: {
          type: Schema.Types.ObjectId,
          ref: "Designation",
        },
        WorkOrderRoleHired: Number,
        RequiredManpower: Number,
        hiredEmpworkedDays: Number,
        Variation: Number,
        TotalNoOfManDays: Number,
        WOWages: Number,
        BillAmount: Number,
      },
    ],
    isPaySlipGenerated: { type: Boolean, default: false },
    payslipPath: String,
  },
  {
    timestamps: true,
  }
);

autoIncrement.initialize(mongoose.connection);
BillSchema.plugin(autoIncrement.plugin, {
  model: "Bill",
  field: "BillId",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("Bill", BillSchema);
