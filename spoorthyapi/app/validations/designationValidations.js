const Joi = require('joi');

const addDesignationSchema = Joi.object({
    name: Joi.string().required(),
})

const editDesignationSchema = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required(),
})

const designationSchema = Joi.object({
    id: Joi.string().required(),
})

const ValidationTypes = {
    DESIGNATION_UPDATE: 'update_name',
    DESIGNATION_ID: 'name_id',
    DESIGNATION_EDIT: 'name_edit'
}

function validate(type, data) {
    if (type == ValidationTypes.DESIGNATION_UPDATE) {
        return addDesignationSchema.validate(data);
    } else if (type == ValidationTypes.DESIGNATION_ID) {
        return designationSchema.validate(data);
    } else if (type == ValidationTypes.DESIGNATION_EDIT) {
        return editDesignationSchema.validate(data);
    }
}

module.exports = {
    ValidationTypes,
    validate
}