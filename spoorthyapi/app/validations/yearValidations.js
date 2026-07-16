const Joi = require('joi');

const addYearSchema = Joi.object({
    Year: Joi.string().required(),
})

const editYearSchema = Joi.object({
    Year: Joi.string().required(),
    id: Joi.string().required(),
})

const yearSchema = Joi.object({
    id: Joi.string().required(),
})

const ValidationTypes = {
    YEAR_UPDATE: 'update_year',
    YEAR_ID: 'year_id',
    YEAR_EDIT: 'year_edit'
}

function validate(type, data) {
    if (type == ValidationTypes.YEAR_UPDATE) {
        return addYearSchema.validate(data);
    } else if (type == ValidationTypes.YEAR_ID) {
        return yearSchema.validate(data);
    } else if (type == ValidationTypes.YEAR_EDIT) {
        return editYearSchema.validate(data);
    }
}


module.exports = {
    ValidationTypes,
    validate
}