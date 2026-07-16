const Joi = require('joi');

const addReligionSchema = Joi.object({
    name: Joi.string().required(),
})

const editReligionSchema = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required(),
})

const religionSchema = Joi.object({
    id: Joi.string().required(),
})

const ValidationTypes = {
    RELIGION_UPDATE: 'update_name',
    RELIGION_ID: 'name_id',
    RELIGION_EDIT: 'name_edit'
}

function validate(type, data) {
    if (type == ValidationTypes.RELIGION_UPDATE) {
        return addReligionSchema.validate(data);
    } else if (type == ValidationTypes.RELIGION_ID) {
        return religionSchema.validate(data);
    } else if (type == ValidationTypes.RELIGION_EDIT) {
        return editReligionSchema.validate(data);
    }
}

module.exports = {
    ValidationTypes,
    validate
}