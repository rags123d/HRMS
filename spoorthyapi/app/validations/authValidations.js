const Joi = require('joi');

const sendOtpSchema = Joi.object({
    mobile: Joi.string()
})

const sendSMSSchema = Joi.object({
    name: Joi.string().required(),
    phoneNo: Joi.string().required(),
    sharelink: Joi.string().required()
})

const verifyOtpSchema = Joi.object({
    mobile: Joi.string(),
    otp: Joi.string().required()
})

const loginSchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
})

const addAdminSchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required(),
    role: Joi.string().required()
})

const forgotPasswordSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().required()
})

const ValidationTypes = {
    SEND_OTP: 'send_otp',
    VERIFY_OTP: 'verify_otp',
    
    SEND_SMS: 'send_sms',

    ADD_ADMIN: 'add_admin',

    ADMIN_LOGIN: 'admin_login',
    ADMIN_FORGOT_PASSWORD: 'admin_forgot_password'
}

function validate(type, data) {
    if (type == ValidationTypes.SEND_OTP) {
        return sendOtpSchema.validate(data)
    } else if (type == ValidationTypes.VERIFY_OTP) {
        return verifyOtpSchema.validate(data);
    } else if (type == ValidationTypes.ADD_ADMIN) {
        return addAdminSchema.validate(data);
    } else if (type == ValidationTypes.ADMIN_FORGOT_PASSWORD) {
        return forgotPasswordSchema.validate(data);
    } else if (type == ValidationTypes.ADMIN_LOGIN) {
        return loginSchema.validate(data);
    } else if (type == ValidationTypes.SEND_SMS) {
        return sendSMSSchema.validate(data)
    } 
}

module.exports = {
    ValidationTypes,
    validate
}