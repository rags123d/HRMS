const Joi = require('joi');

const employeeLogsSchema = Joi.object({
    skip: Joi.number(),
    limit: Joi.number(),
    searchText: Joi.string()
})

const ValidationTypes = {
    EMPLOYEE_LOG_SCHEMA: 'employee_logs_schema',
}

function validate(type, data) {
    if (type == ValidationTypes.EMPLOYEE_LOG_SCHEMA) {
        return employeeLogsSchema.validate(data)
    }
}

module.exports = {
    ValidationTypes,
    validate
}