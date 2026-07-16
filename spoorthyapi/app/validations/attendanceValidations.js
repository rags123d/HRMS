const Joi = require('joi');

const attendanceSchema = Joi.object({
    id: Joi.string().required(),
    Month: Joi.string().required(),
    Year: Joi.number().required()
})

const ValidationTypes = {
    ATTENDANCE: 'get_attendance',
}

function validate(type, data) {
    if (type == ValidationTypes.ATTENDANCE) {
        return attendanceSchema.validate(data);
    }
}

module.exports = {
    ValidationTypes,
    validate
}