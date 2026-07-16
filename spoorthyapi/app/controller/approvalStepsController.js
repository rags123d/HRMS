const EmployeeModel = require('../model/employee')
const ClientModel = require('../model/client')
const WorkOrderModel = require('../model/workOrder')
const WorkOrderRoleModel = require('../model/workOrderRole')
const ApprovalStepsValidations = require('../validations/approvalStepsValidations');
const Enum = require('../constants/enum')
const GeneralUtils = require('../utils/generalUtils');
const EmployeeLogsModel = require('../model/employeeLogs');
const DashboardValidations = require('../validations/dashboardValidations');

exports.GMApproval = async function (req, res) {
    const { error, value } = ApprovalStepsValidations
        .validate(ApprovalStepsValidations.ValidationTypes.GM_APPROVAL, req.body)

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    try {
        await EmployeeModel
            .findOne({ _id: value.id })
            .exec(async (err, employee) => {
                if (err) {
                    return res
                        .status(400)
                        .send({ success: false, message: "internal server error" })
                } else if (!employee) {
                    return res
                        .status(400)
                        .send({ success: false, message: "Employee not found" })
                } else {

                    if (value.ApprovedByGM) {
                        employee.Status = Enum.EMPLOYEE_STATUS.UNDER_MD_APPROVAL

                        employee.InterviewDetail[1] = {
                            Name: 'Approved By General Manager',
                            UpdatedOn: new Date(),
                            SalarySet: value.GrossSalary,
                            Status: "Approved",
                            Remarks: value.RemarksByGM
                        }
                    } else {
                        employee.Status = Enum.EMPLOYEE_STATUS.REJECTED

                        employee.InterviewDetail[1] = {
                            Name: 'Approved By General Manager',
                            UpdatedOn: new Date(),
                            SalarySet: value.GrossSalary,
                            Status: "Rejected",
                            Remarks: value.RemarksByGM
                        }

                        // await WorkOrderModel
                        //     .findOne({ _id: employee.WorkOrder })
                        //     .exec(async (err, workOrder) => {
                        //         if (err) {
                        //             return res
                        //                 .status(500)
                        //                 .send({ success: false, message: 'Internal server error' });
                        //         }

                        //         var underApproval = 0;
                        //         if (workOrder.underapproval > 0) {
                        //             underApproval = 1 + (+(workOrder.underapproval));
                        //         }
                        //         else {
                        //             underApproval = 1;
                        //         }
                        //         var UpdateApproval = { underapproval: (underApproval) }
                        //         await WorkOrderModel.updateOne({ _id: employee.WorkOrder }, { $set: UpdateApproval });

                        //     })

                        // await WorkOrderRoleModel
                        //     .findOne({ _id: employee.WorkOrderRole })
                        //     .exec(async (err, workOrderRole) => {
                        //         if (err) {
                        //             return res
                        //                 .status(500)
                        //                 .send({ success: false, message: 'Internal server error' });
                        //         }

                        //         var underApproval = 0;
                        //         if (workOrderRole.underapproval > 0) {
                        //             underApproval = 1 + (+(workOrderRole.underapproval));
                        //         }
                        //         else {
                        //             underApproval = 1;
                        //         }
                        //         var UpdateApproval = { underapproval: (workOrderRole.underapproval - 1) }
                        //         await WorkOrderRoleModel.updateOne({ _id: employee.WorkOrderRole }, { $set: UpdateApproval });
                        //     })

                        await WorkOrderModel
                            .findOne({ _id: employee.WorkOrder })
                            .exec(async (err, workOrder) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }

                                // if (workOrder.underapproval != undefined) {
                                if (workOrder.underapproval > 0) {
                                    var UpdateApproval = { underapproval: (workOrder.underapproval - 1) }
                                    await WorkOrderModel.updateOne({ _id: employee.WorkOrder }, { $set: UpdateApproval });
                                }
                            })

                        await WorkOrderRoleModel
                            .findOne({ _id: employee.WorkOrderRole })
                            .exec(async (err, workOrderRole) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }

                                if (workOrderRole.underapproval != undefined) {
                                    var UpdateApproval = { underapproval: (workOrderRole.underapproval - 1) }
                                    await WorkOrderRoleModel.updateOne({ _id: employee.WorkOrderRole }, { $set: UpdateApproval });
                                }
                            })
                    }


                    employee.ApprovedByGM = value.ApprovedByGM
                    employee.RemarksByGM = value.RemarksByGM
                    employee.GMApprovedDate = new Date()
                    employee.RejectionRemark = value.RemarksByGM


                    if (!employee.ViewStatus || !(employee.ViewStatus.length > 0)) {
                        employee.ViewStatus = [];
                    }
                    employee.ViewStatus = [...employee.ViewStatus,
                    {
                        Title: Enum.APPROVAL_STATUS.GENERAL_MANAGER,
                        Remark: value.RemarksByGM,
                        Date: new Date()
                    }]

                    await EmployeeModel.updateOne({ _id: employee._id }, { $set: employee })


                    return res
                        .status(200)
                        .send({ success: true, message: "GM Application Updated" })
                }
            })

    } catch (err) {
        console.log("error - controller ", error);
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' });
    }
}

exports.MDApproval = async function (req, res) {
    const { error, value } = ApprovalStepsValidations
        .validate(ApprovalStepsValidations.ValidationTypes.MD_APPROVAL, req.body)

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    try {
        await EmployeeModel
            .findOne({ _id: value.id })
            .exec(async (err, employee) => {
                if (err) {
                    return res
                        .status(400)
                        .send({ success: false, message: "internal server error" })
                } else if (!employee) {
                    return res
                        .status(400)
                        .send({ success: false, message: "Employee not found" })
                } else {

                    if (value.ApprovedByMD) {
                        employee.Status = Enum.EMPLOYEE_STATUS.HIRED
                        employee.IsEmployee = true
                        employee.HiredOn = new Date()

                        employee.GrossSalary = value.GrossSalary

                        employee.InterviewDetail[2] = {
                            Name: 'Approved By Managing Director',
                            UpdatedOn: new Date(),
                            SalarySet: value.GrossSalary,
                            Status: "Approved",
                            Remarks: value.RemarksByMD
                        }

                        await WorkOrderModel
                            .findOne({ _id: employee.WorkOrder })
                            .exec(async (err, workOrder) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }

                                // if (workOrder.underapproval != undefined) {
                                if (workOrder.underapproval > 0) {
                                    var UpdateData = {
                                        underapproval: (workOrder.underapproval - 1),
                                        // noOfRequirements: (workOrder.noOfRequirements - 1),
                                        hired: (workOrder.hired + 1)
                                    }
                                    await WorkOrderModel.updateOne({ _id: employee.WorkOrder }, { $set: UpdateData });
                                }

                                await ClientModel
                                    .findOne({ _id: workOrder.client })
                                    .exec(async (err, client) => {
                                        if (err) {
                                            return res
                                                .status(500)
                                                .send({ success: false, message: 'Internal server error' });
                                        }

                                        if (client.employeeRequirement != undefined || client.hired != undefined) {
                                            var UpdateData = {
                                                // employeeRequirement: (client.employeeRequirement - 1),
                                                hired: (client.hired + 1)
                                            }
                                            await ClientModel.updateOne({ _id: workOrder.client }, { $set: UpdateData });
                                        }

                                    })
                            })

                        await WorkOrderRoleModel
                            .findOne({ _id: employee.WorkOrderRole })
                            .exec(async (err, workOrderRole) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }

                                // if (workOrderRole.underapproval != undefined) {
                                if (workOrderRole.underapproval > 0) {
                                    var UpdateData = {
                                        underapproval: (workOrderRole.underapproval - 1),
                                        // noOfManpower: (workOrderRole.noOfManpower - 1),
                                        hired: (workOrderRole.hired + 1)
                                    }
                                    await WorkOrderRoleModel.updateOne({ _id: employee.WorkOrderRole }, { $set: UpdateData });
                                }
                            })

                    } else {
                        employee.Status = Enum.EMPLOYEE_STATUS.REJECTED

                        employee.InterviewDetail[2] = {
                            Name: 'Approved By Managing Director',
                            UpdatedOn: new Date(),
                            SalarySet: value.GrossSalary,
                            Status: "Rejected",
                            Remarks: value.RemarksByMD
                        }

                        await WorkOrderModel
                            .findOne({ _id: employee.WorkOrder })
                            .exec(async (err, workOrder) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }

                                // if (workOrder.underapproval != undefined) {
                                if (workOrder.underapproval > 0) {
                                    var UpdateApproval = { underapproval: (workOrder.underapproval - 1) }
                                    await WorkOrderModel.updateOne({ _id: employee.WorkOrder }, { $set: UpdateApproval });
                                }
                            })

                        await WorkOrderRoleModel
                            .findOne({ _id: employee.WorkOrderRole })
                            .exec(async (err, workOrderRole) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }

                                // if (workOrderRole.underapproval != undefined) {
                                if (workOrderRole.underapproval > 0) {
                                    var UpdateApproval = { underapproval: (workOrderRole.underapproval - 1) }
                                    await WorkOrderRoleModel.updateOne({ _id: employee.WorkOrderRole }, { $set: UpdateApproval });
                                }
                            })
                    }

                    employee.ApprovedByMD = value.ApprovedByMD
                    employee.RemarksByMD = value.RemarksByMD
                    employee.MDApprovedDate = new Date()
                    employee.RejectionRemark = value.RemarksByMD


                    if (!employee.ViewStatus || !(employee.ViewStatus.length > 0)) {
                        employee.ViewStatus = [];
                    }
                    employee.ViewStatus = [...employee.ViewStatus,
                    {
                        Title: Enum.APPROVAL_STATUS.MANAGING_DIRECTOR,
                        Remark: value.RemarksByMD,
                        Date: new Date()
                    },
                    {
                        Title: Enum.APPROVAL_STATUS.HIRED,
                        Remark: '',
                        Date: new Date()
                    }]

                    await EmployeeModel.updateOne({ _id: employee._id }, { $set: employee })

                    var EmployeeLogsData = {
                        Employee: employee._id,
                        EmployeeID: employee.UniqueEmpId,
                        EmployeeName: employee.FullName,
                        Gender: employee.Gender,
                        GrossSalary: employee.GrossSalary,
                        NetSalary: employee.NetSalary,
                        DeductedSalary: employee.DeductedSalary,
                        ClientData: employee.WorkOrder,
                        WorkOrderData: employee.WorkOrderRole,
                        DateOfJoining: employee.DateOfJoining,
                        DateOfExit: employee.DateOfExit,
                        ReasonForExit: employee.ReasonForExit,
                    };

                    var empLogsData = new EmployeeLogsModel(EmployeeLogsData);

                    empLogsData.save((err, empHistory) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ success: false, message: 'Internal server error' });
                        }
                    })

                    return res
                        .status(200)
                        .send({ success: true, message: "MD Application Updated" })
                }
            })

    } catch (err) {
        console.log("error - controller ", error);
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' });
    }
}


exports.getGMApprovalList = async function (req, res) {
    const { error, value } = DashboardValidations
        .validate(DashboardValidations.ValidationTypes.DASHBOARD_LISTING_SCHEMA, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        EmployeeModel
            .find({ isDeleted: false, Status: "Under GM Approval" })

            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: true, message: 'Internal server error' })
                }
                return res
                    .status(200)
                    .send({ success: true, data: result })
            })
    }
}

exports.getMDApprovalList = async function (req, res) {
    const { error, value } = DashboardValidations
        .validate(DashboardValidations.ValidationTypes.DASHBOARD_LISTING_SCHEMA, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        EmployeeModel
            .find({ isDeleted: false, Status: "Under MD Approval" })

            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: true, message: 'Internal server error' })
                }
                return res
                    .status(200)
                    .send({ success: true, data: result })
            })
    }
}

exports.GMApprovalList = async function (req, res) {
    const { error, value } = ApprovalStepsValidations
        .validate(ApprovalStepsValidations.ValidationTypes.GM_APPROVAL_LIST, req.body)

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    try {
        await EmployeeModel
            .findOne({ _id: value.id })
            .exec(async (err, employee) => {
                if (err) {
                    return res
                        .status(200)
                        .send({ success: false, message: "internal server error" })
                } else if (!employee) {
                    return res
                        .status(200)
                        .send({ success: false, message: "Employee not found" })
                } else if (employee.WorkOrder == undefined) {
                    return res
                        .status(200)
                        .send({ success: false, message: "Please assign the client with full details." })
                } else {

                    if (value.ApprovedByGM) {
                        employee.Status = Enum.EMPLOYEE_STATUS.UNDER_MD_APPROVAL

                        employee.InterviewDetail[1] = {
                            Name: 'Approved By General Manager',
                            UpdatedOn: new Date(),
                            SalarySet: employee.GrossSalary,
                            Status: "Approved",
                            Remarks: "Eligible"
                        }
                    } else {
                        employee.Status = Enum.EMPLOYEE_STATUS.REJECTED

                        employee.InterviewDetail[1] = {
                            Name: 'Approved By General Manager',
                            UpdatedOn: new Date(),
                            SalarySet: employee.GrossSalary,
                            Status: "Rejected",
                            Remarks: "Not Eligible"
                        }

                        await WorkOrderModel
                            .findOne({ _id: employee.WorkOrder })
                            .exec(async (err, workOrder) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }

                                if (workOrder.underapproval > 0) {
                                    var UpdateApproval = { underapproval: (workOrder.underapproval - 1) }
                                    await WorkOrderModel.updateOne({ _id: employee.WorkOrder }, { $set: UpdateApproval });
                                }
                            })

                        await WorkOrderRoleModel
                            .findOne({ _id: employee.WorkOrderRole })
                            .exec(async (err, workOrderRole) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }

                                if (workOrderRole.underapproval != undefined) {
                                    var UpdateApproval = { underapproval: (workOrderRole.underapproval - 1) }
                                    await WorkOrderRoleModel.updateOne({ _id: employee.WorkOrderRole }, { $set: UpdateApproval });
                                }
                            })
                    }


                    employee.ApprovedByGM = value.ApprovedByGM
                    employee.RemarksByGM = value.ApprovedByGM == true ? "Eligible" : " "
                    employee.GMApprovedDate = new Date()
                    employee.RejectionRemark = value.ApprovedByGM == false ? "Not Eligible" : " "


                    if (!employee.ViewStatus || !(employee.ViewStatus.length > 0)) {
                        employee.ViewStatus = [];
                    }
                    employee.ViewStatus = [...employee.ViewStatus,
                    {
                        Title: Enum.APPROVAL_STATUS.GENERAL_MANAGER,
                        Remark: value.ApprovedByGM == true ? "Eligible" : "Not Eligible",
                        Date: new Date()
                    }]

                    await EmployeeModel.updateOne({ _id: employee._id }, { $set: employee })


                    return res
                        .status(200)
                        .send({ success: true, message: "GM Application Updated" })
                }
            })

    } catch (err) {
        console.log("error - controller ", error);
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' });
    }
}

exports.MDApprovalList = async function (req, res) {
    const { error, value } = ApprovalStepsValidations
        .validate(ApprovalStepsValidations.ValidationTypes.MD_APPROVAL_LIST, req.body)

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    try {
        await EmployeeModel
            .findOne({ _id: value.id })
            .exec(async (err, employee) => {
                if (err) {
                    return res
                        .status(200)
                        .send({ success: false, message: "internal server error" })
                } else if (!employee) {
                    return res
                        .status(200)
                        .send({ success: false, message: "Employee not found" })
                } else if (employee.WorkOrder == undefined) {
                    return res
                        .status(200)
                        .send({ success: false, message: "Please assign the client with full details." })
                } else {

                    if (value.ApprovedByMD) {
                        employee.Status = Enum.EMPLOYEE_STATUS.HIRED
                        employee.IsEmployee = true
                        employee.HiredOn = new Date()

                        employee.GrossSalary = value.GrossSalary

                        employee.InterviewDetail[2] = {
                            Name: 'Approved By Managing Director',
                            UpdatedOn: new Date(),
                            SalarySet: employee.GrossSalary,
                            Status: "Approved",
                            Remarks: "Eligible"
                        }

                        await WorkOrderModel
                            .findOne({ _id: employee.WorkOrder })
                            .exec(async (err, workOrder) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }

                                // if (workOrder.underapproval != undefined) {
                                if (workOrder.underapproval > 0) {
                                    var UpdateData = {
                                        underapproval: (workOrder.underapproval - 1),
                                        // noOfRequirements: (workOrder.noOfRequirements - 1),
                                        hired: (workOrder.hired + 1)
                                    }
                                    await WorkOrderModel.updateOne({ _id: employee.WorkOrder }, { $set: UpdateData });
                                }

                                await ClientModel
                                    .findOne({ _id: workOrder.client })
                                    .exec(async (err, client) => {
                                        if (err) {
                                            return res
                                                .status(500)
                                                .send({ success: false, message: 'Internal server error' });
                                        }

                                        if (client.employeeRequirement != undefined || client.hired != undefined) {
                                            var UpdateData = {
                                                // employeeRequirement: (client.employeeRequirement - 1),
                                                hired: (client.hired + 1)
                                            }
                                            await ClientModel.updateOne({ _id: workOrder.client }, { $set: UpdateData });
                                        }

                                    })
                            })

                        await WorkOrderRoleModel
                            .findOne({ _id: employee.WorkOrderRole })
                            .exec(async (err, workOrderRole) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }

                                // if (workOrderRole.underapproval != undefined) {
                                if (workOrderRole.underapproval > 0) {
                                    var UpdateData = {
                                        underapproval: (workOrderRole.underapproval - 1),
                                        // noOfManpower: (workOrderRole.noOfManpower - 1),
                                        hired: (workOrderRole.hired + 1)
                                    }
                                    await WorkOrderRoleModel.updateOne({ _id: employee.WorkOrderRole }, { $set: UpdateData });
                                }
                            })

                    } else {
                        employee.Status = Enum.EMPLOYEE_STATUS.REJECTED

                        employee.InterviewDetail[2] = {
                            Name: 'Approved By Managing Director',
                            UpdatedOn: new Date(),
                            SalarySet: employee.GrossSalary,
                            Status: "Rejected",
                            Remarks: "Not Eligible"
                        }

                        await WorkOrderModel
                            .findOne({ _id: employee.WorkOrder })
                            .exec(async (err, workOrder) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }

                                // if (workOrder.underapproval != undefined) {
                                if (workOrder.underapproval > 0) {
                                    var UpdateApproval = { underapproval: (workOrder.underapproval - 1) }
                                    await WorkOrderModel.updateOne({ _id: employee.WorkOrder }, { $set: UpdateApproval });
                                }
                            })

                        await WorkOrderRoleModel
                            .findOne({ _id: employee.WorkOrderRole })
                            .exec(async (err, workOrderRole) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }

                                // if (workOrderRole.underapproval != undefined) {
                                if (workOrderRole.underapproval > 0) {
                                    var UpdateApproval = { underapproval: (workOrderRole.underapproval - 1) }
                                    await WorkOrderRoleModel.updateOne({ _id: employee.WorkOrderRole }, { $set: UpdateApproval });
                                }
                            })
                    }

                    employee.ApprovedByMD = value.ApprovedByMD
                    employee.RemarksByMD = value.ApprovedByMD == true ? "Eligible" : " "
                    employee.MDApprovedDate = new Date()
                    employee.RejectionRemark = value.ApprovedByMD == false ? "Not Eligible" : " "


                    if (!employee.ViewStatus || !(employee.ViewStatus.length > 0)) {
                        employee.ViewStatus = [];
                    }
                    employee.ViewStatus = [...employee.ViewStatus,
                    {
                        Title: Enum.APPROVAL_STATUS.MANAGING_DIRECTOR,
                        Remark: value.ApprovedByMD == true ? "Eligible" : "Not Eligible",
                        Date: new Date()
                    },
                    {
                        Title: Enum.APPROVAL_STATUS.HIRED,
                        Remark: '',
                        Date: new Date()
                    }]

                    await EmployeeModel.updateOne({ _id: employee._id }, { $set: employee })

                    var EmployeeLogsData = {
                        Employee: employee._id,
                        EmployeeID: employee.UniqueEmpId,
                        EmployeeName: employee.FullName,
                        Gender: employee.Gender,
                        GrossSalary: employee.GrossSalary,
                        NetSalary: employee.NetSalary,
                        DeductedSalary: employee.DeductedSalary,
                        ClientData: employee.WorkOrder,
                        WorkOrderData: employee.WorkOrderRole,
                        DateOfJoining: employee.DateOfJoining,
                        DateOfExit: employee.DateOfExit,
                        ReasonForExit: employee.ReasonForExit,
                    };

                    var empLogsData = new EmployeeLogsModel(EmployeeLogsData);

                    empLogsData.save((err, empHistory) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ success: false, message: 'Internal server error' });
                        }
                    })

                    return res
                        .status(200)
                        .send({ success: true, message: "MD Application Updated" })
                }
            })

    } catch (err) {
        console.log("error - controller ", error);
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' });
    }
}