const Joi = require('joi');

const UserSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().allow('', null),
    userName: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().allow('', null),
    mobile: Joi.string().required(),
    role: Joi.string().required(),
    age: Joi.number().required(),
    gender: Joi.string().required(),
    // place: Joi.string().required(),
    // languages: Joi.string().required()
    presentAddress: Joi.string().required(),
    permanentAddress: Joi.string().allow('', null),
})

const editUserSchema = Joi.object({
    id: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().allow('', null),
    userName: Joi.string().required(),
    email: Joi.string().allow('', null),
    mobile: Joi.string().required(),
    role: Joi.string().required(),
    age: Joi.number().required(),
    gender: Joi.string().required(),
    // place: Joi.string().required(),
    // languages: Joi.string().required(),
    presentAddress: Joi.string().required(),
    permanentAddress: Joi.string().allow('', null),
})



const UserIDSchema = Joi.object({
    id: Joi.string().required()
})

const StatusSchema = Joi.object({
    id: Joi.string().required(),
    isLeave: Joi.boolean().required()
})

const LocationSchema = Joi.object({
    id: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    locationRemark: Joi.string().required()
})

const ValidationTypes = {
    USER_ID: 'user_id',
    ADD_USER: 'add_user',
    SET_STATUS: 'set_status',
    SET_LOCATION: 'set_location',
    EDIT_USER: 'edit_user',
}

function validate(type, data) {
    if (type == ValidationTypes.ADD_USER) {
        return UserSchema.validate(data)
    } else if (type == ValidationTypes.SET_STATUS) {
        return StatusSchema.validate(data);
    } else if (type == ValidationTypes.SET_LOCATION) {
        return LocationSchema.validate(data);
    } else if (type == ValidationTypes.USER_ID) {
        return UserIDSchema.validate(data);
    } else if (type == ValidationTypes.EDIT_USER) {
        return editUserSchema.validate(data);
    }
}

module.exports = {
    ValidationTypes,
    validate
}