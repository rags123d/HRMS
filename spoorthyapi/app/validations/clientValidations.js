const Joi = require('joi');

const clientRegisterSchema = Joi.object({
    id: Joi.string(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    officePhoneNo: Joi.string(),
    contactPerson: Joi.string().required(),
    designation: Joi.string().required(),
    cantactNo: Joi.string().required(),
    email: Joi.string().required(),
    GSTIN: Joi.string(),
    PAN: Joi.string(),
    TAN: Joi.string(),
    pinCode: Joi.number().required(),
    contactEmail: Joi.string().required(),
})

const clientIdSchema = Joi.object({
    id: Joi.string().required()
})

const ValidationTypes = {
    CLIENT_REGISTER: 'register_client',
    CLIENT_ID: 'client_id'
}

function validate(type, data) {
    if (type == ValidationTypes.CLIENT_REGISTER) {
        return clientRegisterSchema.validate(data);
    } else if (type == ValidationTypes.CLIENT_ID) {
        return clientIdSchema.validate(data);
    }
}

module.exports = {
    ValidationTypes,
    validate
}