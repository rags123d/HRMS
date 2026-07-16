const Joi = require('joi');

const paySlipFilterSchema = Joi.object({
    EmpID: Joi.string(),
    SelectedMonth: Joi.string(),
    SelectedYear: Joi.string()
})

const ValidationTypes = {
    PAYSLIP_FILTER_SCHEMA: 'paySlip_Filter_Schema'
}

function validate(type, data) {
    if (type == ValidationTypes.PAYSLIP_FILTER_SCHEMA) {
        return paySlipFilterSchema.validate(data)
    }
}

module.exports = {
    ValidationTypes,
    validate
}