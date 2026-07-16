const Joi = require('joi');
const DesignationModel = require('../model/designation');

const workOrderRegisterSchema = Joi.object({
    id: Joi.string(),
    workOrderType: Joi.string(),
    mainWorkOrderId: Joi.string(),
    name: Joi.string().required(),
    noOfRequirements: Joi.number().required(),
    StartDate: Joi.date().required(),
    RenewalDate: Joi.date().required(),
    depositAmount: Joi.number().required(),
    eprocReference: Joi.string().required(),
    spoorthyReference: Joi.string().required(),
    workOrderNumber: Joi.string().required(),
    bankGuaranteeNumber: Joi.string().required(),
    client: Joi.string().required(),
    workOrderRoles: Joi.string().required(),
    eprocDate: Joi.date().required(),
    bankGuaranteeDate: Joi.date().required(),
})

const workorderIdSchema = Joi.object({
    id: Joi.string().required(),
    skip: Joi.number(),
    limit: Joi.number(),
})

const clientIdSchema = Joi.object({
    id: Joi.string().required(),
    skip: Joi.number(),
    limit: Joi.number(),
})

const ValidationTypes = {
    WORKORDER_REGISTER: 'register_workorder',
    WORKORDER_ID: 'workorder_id',
    CLIENT_ID: 'client_id',
}

function validate(type, data) {
    if (type == ValidationTypes.WORKORDER_REGISTER) {
        return workOrderRegisterSchema.validate(data);
    } else if (type == ValidationTypes.WORKORDER_ID) {
        return workorderIdSchema.validate(data);
    } else if (type == ValidationTypes.CLIENT_ID) {
        return clientIdSchema.validate(data);
    }
}

async function validateWorkOrderRoles(WorkOrderRolesDetails) {
    if(WorkOrderRolesDetails){
        WorkOrderRolesDetails = JSON.parse(WorkOrderRolesDetails);
        if (Array.isArray(WorkOrderRolesDetails) && WorkOrderRolesDetails.length > 0) {
            for (const WorkOrderRoles of WorkOrderRolesDetails) {
                try {
                    const role = await DesignationModel.findOne({ _id: WorkOrderRoles.role })
                    if (!role) {
                        return { success: false, message: 'role not found' };
                    }
                    if(!WorkOrderRoles.noOfManpower){
                        return { success: false, message: 'WorkOrderRoles noOfManpower required' };
                    }
                    if(!WorkOrderRoles.siteAddress){
                        return { success: false, message: 'WorkOrderRoles siteAddress required' };
                    }
                    if(!WorkOrderRoles.salary){
                        return { success: false, message: 'WorkOrderRoles salary required' };
                    }
                } catch (error) {
                    console.log("Error - validateWorkOrderRoles ", error);
                    return { success: false, message: 'Internal server error' };
                }
            }
            return { success: true, message: '' };
        }
    }
    return { success: false, message: 'WorkOrderRolesDetails is required' };
}

module.exports = {
    ValidationTypes,
    validate,
    validateWorkOrderRoles
}