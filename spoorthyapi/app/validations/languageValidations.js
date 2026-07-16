const Joi = require('joi');

const addLanguageSchema = Joi.object({
    name: Joi.string().required(),
})

const editLanguageSchema = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required(),
})

const languageNameSchema = Joi.object({
    id: Joi.string().required(),
})

const ValidationTypes = {
    LANGUAGE_UPDATE: 'update_name',
    LANGUAGE_ID: 'name_id',
    LANGUAGE_EDIT: 'name_edit'
}

function validate(type, data) {
    if (type == ValidationTypes.LANGUAGE_UPDATE) {
        return addLanguageSchema.validate(data);
    } else if (type == ValidationTypes.LANGUAGE_ID) {
        return languageNameSchema.validate(data);
    } else if (type == ValidationTypes.LANGUAGE_EDIT) {
        return editLanguageSchema.validate(data);
    }
}

module.exports = {
    ValidationTypes,
    validate
}