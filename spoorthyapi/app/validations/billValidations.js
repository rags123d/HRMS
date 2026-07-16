const Joi = require('joi');
const EmployeeModel = require('../model/employee')

const billSchema = Joi.object({
    id: Joi.string(),
    WorkOrder: Joi.string(),
    Client: Joi.string(),
    Employees: Joi.array().items({
        Employee: Joi.string(),
        NoOfDaysWorked: Joi.number().positive().allow(0),
        NoOfLeaves: Joi.number().positive().allow(0),
        TDSAmount: Joi.number().positive().allow(0),
        AdvanceAmount: Joi.number().positive().allow(0),
        UniformFee: Joi.number().positive().allow(0),
        FineAmount: Joi.number().positive().allow(0),
        OtherDeductionAmount: Joi.number().positive().allow(0),
        SalaryAfterDeduction: Joi.number(),
        IsOTEmp: Joi.boolean(),
        OTBasedOn: Joi.string(),
        NoOfOTDays: Joi.number().positive().allow(0),
        OTWages: Joi.number(),
    }),
    billAbstract: Joi.array().items({
        WorkOrderRole: Joi.string(),
        WOBranch: Joi.string(),
        WorkOrderRoleName: Joi.string(),
        WorkOrderRoleNameId: Joi.string(),
        WorkOrderRoleHired: Joi.number(),
        RequiredManpower: Joi.number(),
        hiredEmpworkedDays: Joi.number(),
        Variation: Joi.number(),
        TotalNoOfManDays: Joi.number(),
        WOWages: Joi.number(),
        BillAmount: Joi.number()
    }),
    Month: Joi.string(),
    Year: Joi.number(),
    DueDate: Joi.date(),
    BillAmount: Joi.number(),
    GrossAmount: Joi.number(),
    TotalAmount: Joi.number(),
    TotalBillAmount: Joi.number(),
    CGST: Joi.number(),
    SGST: Joi.number(),
    IGST: Joi.number(),
    TDS: Joi.number(),
    TDSCGST: Joi.number(),
    TDSSGST: Joi.number(),
    CGSTAmount: Joi.number(),
    SGSTAmount: Joi.number()
})

const billIdSchema = Joi.object({
    id: Joi.string().required()
})

const workOrderIdSchema = Joi.object({
    id: Joi.string().required(),
    skip: Joi.number(),
    limit: Joi.number(),
    searchText: Joi.string(),
})

const monthclientIdSchema = Joi.object({
    id: Joi.string().required(),
    Month: Joi.string().required()
})

const dateSchema = Joi.object({
    Month: Joi.string().required(),
    Year: Joi.string().required()
})

const addPaymentSchema = Joi.object({
    BillId: Joi.string().required(),
    PaymentMode: Joi.string().required(),
    UTR: Joi.string().required(),
    AmountReceived: Joi.number().required(),
    PaymentReceivedOn: Joi.date().required(),
    Remarks: Joi.string().required(),
    VerifiedBy: Joi.string().required()
})

const ValidationTypes = {
    SAVE_BILL: 'save_bill',
    BILL_ID: 'bill_id',
    ADD_PAYMENT: 'add_payment',
    WORKORDER_ID: 'workorder_id',
    MONTH_CLIENT_ID: 'month_client',
    GET_DATE: 'get_date'
}

function validate(type, data) {
    if (type == ValidationTypes.SAVE_BILL) {
        return billSchema.validate(data);
    } else if (type == ValidationTypes.BILL_ID) {
        return billIdSchema.validate(data)
    } else if (type == ValidationTypes.ADD_PAYMENT) {
        return addPaymentSchema.validate(data)
    } else if (type == ValidationTypes.WORKORDER_ID) {
        return workOrderIdSchema.validate(data)
    } else if (type == ValidationTypes.MONTH_CLIENT_ID) {
        return monthclientIdSchema.validate(data)
    } else if (type == ValidationTypes.GET_DATE) {
        return dateSchema.validate(data)
    }
}

async function validateEmployees(EmployeeDetails) {
    if (EmployeeDetails) {
        if (Array.isArray(EmployeeDetails) && EmployeeDetails.length > 0) {
            for (const Employee of EmployeeDetails) {
                try {
                    const employee = await EmployeeModel.findOne({ _id: Employee.Employee })
                    if (!employee) {
                        return { success: false, message: 'Employee not found' };
                    }
                    if (!Employee.NoOfDaysWorked) {
                        return { success: false, message: 'No. of Days Worked required' };
                    }
                    if (!(Employee.NoOfLeaves >= 0)) {
                        return { success: false, message: 'No. of Leaves required' };
                    }
                    if (!Employee.SalaryAfterDeduction) {
                        return { success: false, message: 'Salary after Deduction for Leaves Taken required' };
                    }
                } catch (error) {
                    console.log("Error - validateEmployees ", error);
                    return { success: false, message: 'Internal server error' };
                }
            }
            return { success: true, message: '' };
        }
    }
    return { success: false, message: 'EmployeeDetails is required' };
}

module.exports = {
    ValidationTypes,
    validate,
    validateEmployees,
}

