const Joi = require('joi');

const GMApprovalSchema = Joi.object({
    id: Joi.string().required(),
    GrossSalary: Joi.number(),
    NetSalary: Joi.number(),
    ApprovedByGM: Joi.boolean().required(),
    RemarksByGM: Joi.string().required(),
})

const MDApprovalSchema = Joi.object({
    id: Joi.string().required(),
    GrossSalary: Joi.number(),
    NetSalary: Joi.number(),
    ApprovedByMD: Joi.boolean().required(),
    RemarksByMD: Joi.string().required(),
})

const GMApprovalListSchema = Joi.object({
    id: Joi.string().required(),
    ApprovedByGM: Joi.boolean().required(),
})

const MDApprovalListSchema = Joi.object({
    id: Joi.string().required(),
    ApprovedByMD: Joi.boolean().required(),
})

const ValidationTypes = {
    GM_APPROVAL: 'gm_approval',
    MD_APPROVAL: 'md_approval',
    GM_APPROVAL_LIST: 'gm_approval_list',
    MD_APPROVAL_LIST: 'md_approval_list',
}

function validate(type, data) {
    if (type == ValidationTypes.GM_APPROVAL) {
        return GMApprovalSchema.validate(data);
    } else if(type == ValidationTypes.MD_APPROVAL){
        return MDApprovalSchema.validate(data);
    } else if(type == ValidationTypes.GM_APPROVAL_LIST){
        return GMApprovalListSchema.validate(data);
    } else if(type == ValidationTypes.MD_APPROVAL_LIST){
        return MDApprovalListSchema.validate(data);
    }
}

module.exports = {
    ValidationTypes,
    validate
}