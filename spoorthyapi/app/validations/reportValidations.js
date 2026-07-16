const Joi = require('joi');

const reportUnitBranchSchema = Joi.object({
    WORoleID: Joi.string(),
    SelectedMonth: Joi.string(),
    SelectedYear: Joi.string()
})

const reportDesignationSchema = Joi.object({
    DesignationID: Joi.string(),
    SelectedMonth: Joi.string(),
    SelectedYear: Joi.string()
})

const reportWorkOrderSchema = Joi.object({
    WOID: Joi.string(),
    SelectedMonth: Joi.string(),
    SelectedYear: Joi.string()
})

const reportClientSchema = Joi.object({
    ClientID: Joi.string(),
    SelectedMonth: Joi.string(),
    SelectedYear: Joi.string()
})

const ValidationTypes = {
    REPORT_UNITBRANCH_SCHEMA: 'report_UnitBranch_Schema',
    REPORT_DESIGNATION_SCHEMA: 'report_Designation_Schema',
    REPORT_WORKORDER_SCHEMA: 'report_WorkOrder_Schema',
    REPORT_CLIENT_SCHEMA: 'report_Client_Schema'
}

function validate(type, data) {
    if (type == ValidationTypes.REPORT_UNITBRANCH_SCHEMA) {
        return reportUnitBranchSchema.validate(data)
    }
    else if (type == ValidationTypes.REPORT_DESIGNATION_SCHEMA) {
        return reportDesignationSchema.validate(data)
    }
    else if (type == ValidationTypes.REPORT_WORKORDER_SCHEMA) {
        return reportWorkOrderSchema.validate(data)
    }
    else if (type == ValidationTypes.REPORT_CLIENT_SCHEMA) {
        return reportClientSchema.validate(data)
    }
}

module.exports = {
    ValidationTypes,
    validate
}