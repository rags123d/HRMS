const WorkorderModel = require('../model/workOrder')
const ClientModel = require('../model/client')
const EmployeeModel = require('../model/employee')
const Enum = require('../constants/enum')
const DesignationModel = require('../model/designation')
const GeneralUtils = require('../utils/generalUtils');
const WorkOrderValidations = require('../validations/workOrderValidations');
const WorkOrderRolesModel = require('../model/workOrderRole');
var fs = require('fs');

exports.getMainDashboard = async function (req, res) {
    var TotalWorkOrders = await WorkorderModel.find({ isDeleted: false }).countDocuments()

    var TotalClients = await ClientModel.find({ isDeleted: false }).countDocuments()

    var TotalEmployeesHired = await EmployeeModel.find({ isDeleted: false, IsEmployee: true, Status: Enum.EMPLOYEE_STATUS.HIRED }).countDocuments()

    // var UnderGMApproval = await EmployeeModel.find({ isDeleted: false, IsEmployee: false, Status: Enum.EMPLOYEE_STATUS.UNDER_GM_APPROVAL }).countDocuments()
    // var UnderMDApproval = await EmployeeModel.find({ isDeleted: false, IsEmployee: false, Status: Enum.EMPLOYEE_STATUS.UNDER_MD_APPROVAL }).countDocuments()
    // var WaitingForApproval = UnderGMApproval + UnderMDApproval

    var TotalRequirements = 0;
    var WaitingForApproval = 0;

    var WorkorderCollection = await WorkorderModel.find({ isDeleted: false })
    for (const data of WorkorderCollection) {
        if (data.noOfRequirements != undefined)
            TotalRequirements = TotalRequirements + data.noOfRequirements
        if (data.underapproval != undefined)
            WaitingForApproval = WaitingForApproval + data.underapproval
    }

    var TotalVacancies = TotalRequirements - TotalEmployeesHired

    return res
        .status(200)
        .send({ success: true, data: { TotalClients: TotalClients, TotalWorkOrders: TotalWorkOrders, TotalRequirements: TotalRequirements, TotalEmployeesHired: TotalEmployeesHired, TotalVacancies: TotalVacancies, WaitingForApproval: WaitingForApproval } })
}

exports.getAllClientDashboard = async function (req, res) {
    var TotalWorkOrders = await WorkorderModel.find({ isDeleted: false }).countDocuments()

    var TotalClients = await ClientModel.find({ isDeleted: false }).countDocuments()

    var TotalEmployeesHired = await EmployeeModel.find({ isDeleted: false, IsEmployee: true, Status: Enum.EMPLOYEE_STATUS.HIRED }).countDocuments()


    // var UnderGMApproval = await EmployeeModel.find({ isDeleted: false, IsEmployee: false, Status: Enum.EMPLOYEE_STATUS.UNDER_GM_APPROVAL }).countDocuments()
    // var UnderMDApproval = await EmployeeModel.find({ isDeleted: false, IsEmployee: false, Status: Enum.EMPLOYEE_STATUS.UNDER_MD_APPROVAL }).countDocuments()
    // var WaitingForApproval = UnderGMApproval + UnderMDApproval

    var TotalRequirements = 0;
    var WaitingForApproval = 0;

    var WorkorderCollection = await WorkorderModel.find({ isDeleted: false })
    for (const data of WorkorderCollection) {
        if (data.noOfRequirements != undefined)
            TotalRequirements = TotalRequirements + data.noOfRequirements
        if (data.underapproval != undefined)
            WaitingForApproval = WaitingForApproval + data.underapproval
    }

    var TotalVacancies = TotalRequirements - TotalEmployeesHired

    return res
        .status(200)
        .send({ success: true, data: { TotalClients: TotalClients, TotalWorkOrders: TotalWorkOrders, TotalRequirements: TotalRequirements, TotalEmployeesHired: TotalEmployeesHired, TotalVacancies: TotalVacancies, WaitingForApproval: WaitingForApproval } })
}

exports.getClientDashboardById = async function (req, res) {
    var TotalWorkOrders = await WorkorderModel.find({ isDeleted: false, client: req.body.id }).countDocuments()

    var TotalRequirements = 0;
    var WaitingForApproval = 0;
    var TotalEmployeesHired = 0;

    var EmployeeCollection = await EmployeeModel.find({ isDeleted: false, IsEmployee: true }).populate('WorkOrder')
    for (const data of EmployeeCollection) {
        if (data.WorkOrder.client == req.body.id && data.Status == Enum.EMPLOYEE_STATUS.HIRED)
            TotalEmployeesHired = TotalEmployeesHired + 1
    }


    var WorkorderCollection = await WorkorderModel.find({ isDeleted: false, client: req.body.id })
    for (const data of WorkorderCollection) {
        if (data.noOfRequirements != undefined)
            TotalRequirements = TotalRequirements + data.noOfRequirements
        if (data.underapproval != undefined)
            WaitingForApproval = WaitingForApproval + data.underapproval
    }

    var TotalVacancies = TotalRequirements - TotalEmployeesHired

    return res
        .status(200)
        .send({ success: true, data: { TotalWorkOrders: TotalWorkOrders, TotalRequirements: TotalRequirements, TotalEmployeesHired: TotalEmployeesHired, TotalVacancies: TotalVacancies, WaitingForApproval: WaitingForApproval } })
}

exports.getCandidateDashboard = async function (req, res) {
    var Hired = await EmployeeModel.find({ isDeleted: false, IsEmployee: true, Status: Enum.EMPLOYEE_STATUS.HIRED }).countDocuments()
    var UnderGMApproval = await EmployeeModel.find({ isDeleted: false, IsEmployee: false, Status: Enum.EMPLOYEE_STATUS.UNDER_GM_APPROVAL }).countDocuments()
    var UnderMDApproval = await EmployeeModel.find({ isDeleted: false, IsEmployee: false, Status: Enum.EMPLOYEE_STATUS.UNDER_MD_APPROVAL }).countDocuments()
    var WaitingForApproval = UnderGMApproval + UnderMDApproval
    var RejectedCandidates = await EmployeeModel.find({ isDeleted: false, Status: Enum.EMPLOYEE_STATUS.REJECTED }).countDocuments()

    var TotalRequirements = 0

    var WorkorderCollection = await WorkorderModel.find({ isDeleted: false })
    for (const data of WorkorderCollection) {
        if (data.noOfRequirements != undefined)
            TotalRequirements = TotalRequirements + data.noOfRequirements
    }

    var TotalVacancies = TotalRequirements - Hired

    return res
        .status(200)
        .send({ success: true, data: { Hired: Hired, WaitingForApproval: WaitingForApproval, UnderGMApproval: UnderGMApproval, UnderMDApproval: UnderMDApproval, TotalVacancies: TotalVacancies, RejectedCandidates: RejectedCandidates } })
}

exports.getWorkOrderDashboardById = async function (req, res) {
    var WorkOrder = await WorkorderModel.findOne({ isDeleted: false, _id: req.body.workOrderId })
    if (!WorkOrder) {
        return res
            .status(400)
            .send({ success: false, message: 'WorkOrder not found' })
    }

    var WORequirement = WorkOrder.noOfRequirements
    var WaitingForApproval = WorkOrder.underapproval
    var EmployeeHired = await EmployeeModel.find({ isDeleted: false, WorkOrder: req.body.workOrderId, IsEmployee: true, Status: Enum.EMPLOYEE_STATUS.HIRED }).countDocuments()
    var UnderGMApproval = await EmployeeModel.find({ isDeleted: false, WorkOrder: req.body.workOrderId, IsEmployee: false, Status: Enum.EMPLOYEE_STATUS.UNDER_GM_APPROVAL }).countDocuments()
    var UnderMDApproval = await EmployeeModel.find({ isDeleted: false, WorkOrder: req.body.workOrderId, IsEmployee: false, Status: Enum.EMPLOYEE_STATUS.UNDER_MD_APPROVAL }).countDocuments()
    var WaitingForApproval = UnderGMApproval + UnderMDApproval

    var TotalVacancies = WORequirement - EmployeeHired

    return res
        .status(200)
        .send({ success: true, data: { WORequirement: WORequirement, WaitingForApproval: WaitingForApproval, EmployeeHired: EmployeeHired, TotalVacancies: TotalVacancies, UnderGMApproval: UnderGMApproval, UnderMDApproval: UnderMDApproval } })
}

exports.getAllJobRoleDashboard = async function (req, res) {
    await WorkorderModel
        .find({ isDeleted: false })
        .populate({
            path: 'workOrderRoles',
            populate: {
                path: 'role'
            }
        })
        .exec((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: true, message: 'Internal server error' })
            }

            let workOrderRoleList = [];

            if (result && result.length > 0) {
                result.forEach((wo, i) => {
                    if (wo.workOrderRoles && wo.workOrderRoles.length > 0) {
                        wo.workOrderRoles.forEach(ro => {
                            ro["roleId"] = ro.role._id.toString();
                            ro["roleName"] = ro.role.name;
                        })
                        workOrderRoleList = workOrderRoleList.concat(wo.workOrderRoles);
                    }
                });
            }

            var distinctWorkIds = workOrderRoleList.map(x => x.roleName).filter((x, i, a) => a.indexOf(x) == i);
            var groupBy = function (xs, key) {
                return xs.filter(x => x.roleName == key);
            };

            var groupedArray = [];
            distinctWorkIds.forEach(
                x => groupedArray.push(
                    {
                        RoleName: x,
                        woList: groupBy(workOrderRoleList, x)
                    })
            );

            const resultData = [];
            groupedArray.forEach(item => {
                let val = {
                    RoleName: item.RoleName,
                    Hired: item.woList.reduce((sum, dd) => { return (sum + dd.hired) }, 0),
                    WaitingForApproval: item.woList.reduce((sum, dd) => { return (sum + dd.underapproval) }, 0),
                    UnderGMApproval: item.woList.reduce((sum, dd) => { return (sum + dd.underGMapproval) }, 0),
                    UnderMDApproval: item.woList.reduce((sum, dd) => { return (sum + dd.underMDapproval) }, 0),
                    TotalVacancy: item.woList.reduce((sum, dd) => { return (sum + dd.noOfManpower) }, 0),
                }
                resultData.push(val);
            });

            return res
                .status(200)
                .send({ success: true, data: resultData })
        })
}
