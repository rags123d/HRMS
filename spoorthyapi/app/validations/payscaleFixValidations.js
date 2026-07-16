const Joi = require('joi');

const addPayscaleFixSchema = Joi.object({
    WorkOrder: Joi.string().required(),
    WorkOrderRole: Joi.string().required(),
    ESIBasedOn: Joi.string().allow('', null),

    NetSalary: Joi.number().required(),
    GrossSalary: Joi.number().required(),
    DeductedSalary: Joi.number(),

    benefitType: Joi.string().allow('', null),
    BasicVDA: Joi.number().positive().allow(0),
    Gratuity: Joi.number().positive().allow(0),
    MedicalAllowance: Joi.number().positive().allow(0),
    RelieverCharges: Joi.number().positive().allow(0),
    Bonus: Joi.number().positive().allow(0),
    HRA: Joi.number().positive().allow(0),
    NationalFestivalHolidays: Joi.number().positive().allow(0),
    Conveyance: Joi.number().positive().allow(0),
    LeaveWithWages: Joi.number().positive().allow(0),
    WashingAllowance: Joi.number().positive().allow(0),
    SpecialAllowance: Joi.number().positive().allow(0),
  
    deductionType: Joi.string().allow('', null),
    PFAmount: Joi.number().positive().allow(0),
    ESIAmount: Joi.number().positive().allow(0),
    ProfessionalTax: Joi.number().positive().allow(0),
})

const editPayscaleFixSchema = Joi.object({
    id: Joi.string().required(),
    WorkOrder: Joi.string().required(),
    WorkOrderRole: Joi.string().required(),
    ESIBasedOn: Joi.string().allow('', null),

    NetSalary: Joi.number().required(),
    GrossSalary: Joi.number().required(),
    DeductedSalary: Joi.number(),

    benefitType: Joi.string().allow('', null),
    BasicVDA: Joi.number().positive().allow(0),
    Gratuity: Joi.number().positive().allow(0),
    MedicalAllowance: Joi.number().positive().allow(0),
    RelieverCharges: Joi.number().positive().allow(0),
    Bonus: Joi.number().positive().allow(0),
    HRA: Joi.number().positive().allow(0),
    NationalFestivalHolidays: Joi.number().positive().allow(0),
    Conveyance: Joi.number().positive().allow(0),
    LeaveWithWages: Joi.number().positive().allow(0),
    WashingAllowance: Joi.number().positive().allow(0),
    SpecialAllowance: Joi.number().positive().allow(0),
  
    deductionType: Joi.string().allow('', null),
    PFAmount: Joi.number().positive().allow(0),
    ESIAmount: Joi.number().positive().allow(0),
    ProfessionalTax: Joi.number().positive().allow(0),
})

const payscaleFixSchema = Joi.object({
    id: Joi.string().required(),
})

const ValidationTypes = {
    PAYSCALEFIX_UPDATE: 'update_name',
    PAYSCALEFIX_ID: 'name_id',
    PAYSCALEFIX_EDIT: 'name_edit'
}

function validate(type, data) {
    if (type == ValidationTypes.PAYSCALEFIX_UPDATE) {
        return addPayscaleFixSchema.validate(data);
    } else if (type == ValidationTypes.PAYSCALEFIX_ID) {
        return payscaleFixSchema.validate(data);
    } else if (type == ValidationTypes.PAYSCALEFIX_EDIT) {
        return editPayscaleFixSchema.validate(data);
    }
}

module.exports = {
    ValidationTypes,
    validate
}