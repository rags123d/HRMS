const Joi = require('joi');

const addSalaryStructureSchema = Joi.object({
    name: Joi.string().required(),
})

const editSalaryStructureSchema = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required(),
})

const SalaryStructureSchema = Joi.object({
    id: Joi.string().required(),
})

const ValidationTypes = {
    SalaryStructure_UPDATE: 'update_name',
    SalaryStructure_ID: 'name_id',
    SalaryStructure_EDIT: 'name_edit'
}

function validate(type, data) {
    if (type == ValidationTypes.SalaryStructure_UPDATE) {
        return addSalaryStructureSchema.validate(data);
    } else if (type == ValidationTypes.SalaryStructure_ID) {
        return SalaryStructureSchema.validate(data);
    } else if (type == ValidationTypes.SalaryStructure_EDIT) {
        return editSalaryStructureSchema.validate(data);
    }
}

module.exports = {
    ValidationTypes,
    validate
}