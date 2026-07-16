const Joi = require('joi');

const addRelationshipSchema = Joi.object({
    name: Joi.string().required(),
})

const editRelationshipSchema = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required(),
})

const relationshipSchema = Joi.object({
    id: Joi.string().required(),
})

const ValidationTypes = {
    RELATIONSHIP_UPDATE: 'update_name',
    RELATIONSHIP_ID: 'name_id',
    RELATIONSHIP_EDIT: 'name_edit'
}

function validate(type, data) {
    if (type == ValidationTypes.RELATIONSHIP_UPDATE) {
        return addRelationshipSchema.validate(data);
    } else if (type == ValidationTypes.RELATIONSHIP_ID) {
        return relationshipSchema.validate(data);
    } else if (type == ValidationTypes.RELATIONSHIP_EDIT) {
        return editRelationshipSchema.validate(data);
    }
}

module.exports = {
    ValidationTypes,
    validate
}