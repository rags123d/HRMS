const WorkOrderRoleModel = require('../model/workOrderRole');
const DesignationModel = require('../model/designation');
const WorkOrderModel = require('../model/workOrder');
const ClientModel = require('../model/client');
const EmployeeModel = require('../model/employee');
const AttendanceModel = require('../model/attendance');
const ReportValidations = require('../validations/reportValidations');
const GeneralUtils = require('../utils/generalUtils');


exports.getAllWorkOrderRoles = async function (req, res) {
    WorkOrderRoleModel
        .find({})
        .sort({ name: 1 })
        .populate({
            path: 'role'
        })
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

exports.getAllDesignationwise = async function (req, res) {
    DesignationModel
        .find({ isDeleted: false })
        .sort({ name: 1 })
        .exec(async (err, resultDesign) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: true, message: 'Internal server error' })
            }

            if (resultDesign.length == 0) {
                return res
                    .status(404)
                    .send({ success: true, message: 'No Data Available' })
            }

            await WorkOrderRoleModel
                .find({})
                .sort({ name: 1 })
                .populate({
                    path: 'role'
                })
                .exec((err, resultWORole) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ success: true, message: 'Internal server error' })
                    }

                    if (resultWORole.length > 0) {
                        const transformed = [];

                        resultDesign.forEach((Design, ix) => {
                            let WORole = (resultWORole && resultWORole.length > 0) ?
                                resultWORole.filter(ee => {
                                    let WORoleid = ee.role.id.toString();
                                    let Designationid = Design.id.toString();
                                    return WORoleid == Designationid;
                                }) : [];
                            let NoOfRequirements = 0;
                            let Hired = 0;
                            let UnderApproval = 0;
                            let AvailableVacancy = 0;
                            if (WORole && WORole.length > 0) {
                                var designationwiseData = {
                                    _id: Design._id,
                                    Designation: Design.name,
                                    NoOfRequirements: +(WORole.reduce((sum, curr) => sum + (+(curr.noOfManpower ? curr.noOfManpower : 0)), 0)),
                                    Hired: +(WORole.reduce((sum, curr) => sum + (+(curr.hired ? curr.hired : 0)), 0)),
                                    UnderApproval: +(WORole.reduce((sum, curr) => sum + (+(curr.underapproval ? curr.underapproval : 0)), 0)),
                                    AvailableVacancy: (+(WORole.reduce((sum, curr) => sum + (+(curr.noOfManpower ? curr.noOfManpower : 0)), 0))) -
                                        (+(WORole.reduce((sum, curr) => sum + (+(curr.hired ? curr.hired : 0)), 0)))
                                }

                                transformed.push(designationwiseData)
                            }
                        })

                        return res
                            .status(200)
                            .send({ success: true, data: transformed })
                    }
                })
        })
}

exports.getAllWorkOrder = async function (req, res) {
    WorkOrderModel
        .find({ isDeleted: false })
        .populate('client')
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
            return res
                .status(200)
                .send({ success: true, data: result })
        })
}

exports.getAllClient = async function (req, res) {
    ClientModel
        .find({ isDeleted: false })
        .sort({ name: 1 })
        .populate('designation')
        .exec((err, ClientResult) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: true, message: 'Internal server error' })
            }

            if (ClientResult.length == 0) {
                return res
                    .status(404)
                    .send({ success: true, message: 'No Data Available' })
            }

            let ClientResultIDS = ClientResult.map((ele) => ele._id);

            WorkOrderModel
                .find({ client: ClientResultIDS })
                .populate('client')
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

                    if (result && result.length > 0) {
                        const transformed = [];

                        ClientResult.forEach((Client, ix) => {
                            let WorkOrders = (result && result.length > 0) ?
                                result.filter(ee => {
                                    let WOClientid = ee.client.id.toString();
                                    let ClientID = Client._id.toString();
                                    return WOClientid == ClientID;
                                }) : [];
                            let AvailableVacancy = 0;
                            let UnderApproval = 0;
                            if (WorkOrders) {
                                var clientsData = {
                                    _id: Client._id,
                                    name: Client.name,
                                    workorderCount: Client.workorderCount,
                                    employeeRequirement: Client.employeeRequirement,
                                    hired: Client.hired,
                                    AvailableVacancy: (+(Client.employeeRequirement) - (+(Client.hired))),
                                    UnderApproval: +(WorkOrders.reduce((sum, curr) => sum + (+(curr.underapproval ? curr.underapproval : 0)), 0)),
                                }

                                transformed.push(clientsData)
                            }
                            else {
                                transformed.push(Client)
                            }
                        })

                        return res
                            .status(200)
                            .send({ success: true, data: transformed })
                    }
                })
        })
}



exports.getEmpReportByUnitBranch = async function (req, res) {
    const { error, value } = ReportValidations
        .validate(ReportValidations.ValidationTypes.REPORT_UNITBRANCH_SCHEMA, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        try {
            EmployeeModel
                .find({ WorkOrderRole: value.WORoleID })
                .populate('Gender')
                .populate({
                    path: 'WorkOrder',
                    populate: {
                        path: 'workOrderRoles',
                        populate: {
                            path: 'role'
                        }
                    },
                })
                .populate({
                    path: 'WorkOrder',
                    populate: {
                        path: 'client'
                    }
                })
                .populate({
                    path: 'WorkOrderRole',
                    populate: {
                        path: 'role'
                    }
                })

                .exec((err, Empresult) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ success: true, message: 'Internal server error' })
                    }

                    let EmployeeIDS = Empresult.map((ele) => ele._id);

                    AttendanceModel
                        .find({ Employee: EmployeeIDS, Month: value.SelectedMonth, Year: value.SelectedYear })
                        .exec(async (err, Attndresult) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .send({ success: false, message: 'Internal server error' });
                            }

                            var employeeData = {
                                EmpData: Empresult,
                                AttndData: Attndresult
                            }


                            if (Attndresult && Attndresult.length > 0) {
                                const transformed = [];

                                Empresult.forEach((empData, ix) => {
                                    let AttndData = (Attndresult && Attndresult.length > 0) ?
                                        Attndresult.filter(ee => {
                                            let AttndEmpID = ee.Employee.toString();
                                            let EmpID = empData._id.toString();
                                            return AttndEmpID == EmpID;
                                        }) : [];
                                    if (AttndData && AttndData.length >= 0) {
                                        var resultData = {
                                            _id: empData._id,
                                            UniqueEmpId: empData.UniqueEmpId,
                                            FullName: empData.FullName,
                                            Month: AttndData[0] ? AttndData[0].Month : '-',
                                            Year: AttndData[0] ? AttndData[0].Year : '-',
                                            DateOfExit: empData.DateOfExit,
                                            DateOfJoining: empData.DateOfJoining,
                                            NoOfDaysWorked: AttndData[0] ? AttndData[0].NoOfDaysWorked : '0',
                                            NoOfLeaves: AttndData[0] ? AttndData[0].NoOfLeaves : '0',
                                            NoOfOTDays: AttndData[0] ? AttndData[0].NoOfOTDays : '0',
                                            AccountNumber: empData.AccountNumber,
                                            IFSC: empData.IFSC,
                                            Branch: empData.Branch,
                                            WorkOrderRole: {
                                                branchName: empData.WorkOrderRole.branchName,
                                                siteAddress: empData.WorkOrderRole.siteAddress,
                                                role: {
                                                    name: empData.WorkOrderRole.role.name
                                                },
                                            },
                                            WorkOrder: {
                                                name: empData.WorkOrder.name,
                                                client: {
                                                    name: empData.WorkOrder.client.name
                                                },
                                            },
                                            Gender: {
                                                name: empData.Gender.name
                                            },
                                            ParentName: empData.ParentName,
                                            SpouseName: empData.SpouseName,
                                            DateOfBirth: empData.DateOfBirth,
                                            ReasonForExit: empData.ReasonForExit,
                                            PresentAddress: empData.PresentAddress,
                                            PresentAddressPincode: empData.PresentAddressPincode,
                                            PresentAddressPhone: empData.PresentAddressPhone,
                                            PermanentAddress: empData.PermanentAddress,
                                            PermanentAddressPincode: empData.PermanentAddressPincode,
                                            PermanentAddressPhone: empData.PermanentAddressPhone,
                                            AadharNo: empData.AadharNo,
                                            PAN: empData.PAN,
                                            UniversalAccount: empData.UniversalAccount,
                                            PFAccount: empData.PFAccount,
                                            ESI: empData.ESI,
                                            EMail: empData.EmailId,
                                            PlaceOfBirth: empData.PlaceOfBirth,
                                            GrossSalary: empData.GrossSalary,
                                            Status: empData.Status,
                                        }

                                        transformed.push(resultData)
                                    }
                                })

                                return res
                                    .status(200)
                                    .send({ success: true, data: transformed })
                            }
                            else {
                                return res
                                    .status(200)
                                    .send({ success: false, messege: "Attendance Details are not available for this month and year, Please select a valid month and year." })
                            }

                        })
                })

        }
        catch (error) {
            return res
                .status(500)
                .send({ success: false, message: 'Internal server error' });
        }
    }
}

exports.getEmpReportByDesignation = async function (req, res) {
    const { error, value } = ReportValidations
        .validate(ReportValidations.ValidationTypes.REPORT_DESIGNATION_SCHEMA, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        try {

            WorkOrderRoleModel
                .find({ role: value.DesignationID })
                .populate({
                    path: 'role'
                })
                .exec((err, WORole) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ success: true, message: 'Internal server error' })
                    }

                    let WOroleIDS = WORole.map((ele) => ele._id);

                    EmployeeModel
                        .find({ WorkOrderRole: WOroleIDS })
                        .populate('Gender')
                        .populate({
                            path: 'WorkOrder',
                            populate: {
                                path: 'workOrderRoles',
                                populate: {
                                    path: 'role'
                                }
                            },
                        })
                        .populate({
                            path: 'WorkOrder',
                            populate: {
                                path: 'client'
                            }
                        })
                        .populate({
                            path: 'WorkOrderRole',
                            populate: {
                                path: 'role'
                            }
                        })

                        .exec((err, Empresult) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .send({ success: true, message: 'Internal server error' })
                            }

                            let EmployeeIDS = Empresult.map((ele) => ele._id);

                            AttendanceModel
                                .find({ Employee: EmployeeIDS, Month: value.SelectedMonth, Year: value.SelectedYear })
                                .exec(async (err, Attndresult) => {
                                    if (err) {
                                        return res
                                            .status(500)
                                            .send({ success: false, message: 'Internal server error' });
                                    }

                                    var employeeData = {
                                        EmpData: Empresult,
                                        AttndData: Attndresult
                                    }


                                    if (Attndresult && Attndresult.length > 0) {
                                        const transformed = [];

                                        Empresult.forEach((empData, ix) => {
                                            let AttndData = (Attndresult && Attndresult.length > 0) ?
                                                Attndresult.filter(ee => {
                                                    let AttndEmpID = ee.Employee.toString();
                                                    let EmpID = empData._id.toString();
                                                    return AttndEmpID == EmpID;
                                                }) : [];
                                            if (AttndData && AttndData.length >= 0) {
                                                var resultData = {
                                                    _id: empData._id,
                                                    UniqueEmpId: empData.UniqueEmpId,
                                                    FullName: empData.FullName,
                                                    Month: AttndData[0] ? AttndData[0].Month : '-',
                                                    Year: AttndData[0] ? AttndData[0].Year : '-',
                                                    DateOfExit: empData.DateOfExit,
                                                    DateOfJoining: empData.DateOfJoining,
                                                    NoOfDaysWorked: AttndData[0] ? AttndData[0].NoOfDaysWorked : '0',
                                                    NoOfLeaves: AttndData[0] ? AttndData[0].NoOfLeaves : '0',
                                                    NoOfOTDays: AttndData[0] ? AttndData[0].NoOfOTDays : '0',
                                                    AccountNumber: empData.AccountNumber,
                                                    IFSC: empData.IFSC,
                                                    Branch: empData.Branch,
                                                    WorkOrderRole: {
                                                        branchName: empData.WorkOrderRole.branchName,
                                                        siteAddress: empData.WorkOrderRole.siteAddress,
                                                        role: {
                                                            name: empData.WorkOrderRole.role.name
                                                        },
                                                    },
                                                    WorkOrder: {
                                                        name: empData.WorkOrder.name,
                                                        client: {
                                                            name: empData.WorkOrder.client.name
                                                        },
                                                    },
                                                    Gender: {
                                                        name: empData.Gender.name
                                                    },
                                                    ParentName: empData.ParentName,
                                                    SpouseName: empData.SpouseName,
                                                    DateOfBirth: empData.DateOfBirth,
                                                    ReasonForExit: empData.ReasonForExit,
                                                    PresentAddress: empData.PresentAddress,
                                                    PresentAddressPincode: empData.PresentAddressPincode,
                                                    PresentAddressPhone: empData.PresentAddressPhone,
                                                    PermanentAddress: empData.PermanentAddress,
                                                    PermanentAddressPincode: empData.PermanentAddressPincode,
                                                    PermanentAddressPhone: empData.PermanentAddressPhone,
                                                    AadharNo: empData.AadharNo,
                                                    PAN: empData.PAN,
                                                    UniversalAccount: empData.UniversalAccount,
                                                    PFAccount: empData.PFAccount,
                                                    ESI: empData.ESI,
                                                    EMail: empData.EmailId,
                                                    PlaceOfBirth: empData.PlaceOfBirth,
                                                    GrossSalary: empData.GrossSalary,
                                                    Status: empData.Status,
                                                }

                                                transformed.push(resultData)
                                            }
                                        })

                                        return res
                                            .status(200)
                                            .send({ success: true, data: transformed })
                                    }
                                    else {
                                        return res
                                            .status(200)
                                            .send({ success: false, messege: "Attendance Details are not available for this month and year, Please select a valid month and year." })
                                    }

                                })
                        })

                });

        }
        catch (error) {
            return res
                .status(500)
                .send({ success: false, message: 'Internal server error' });
        }
    }
}

exports.getEmpReportByWorkOrder = async function (req, res) {
    const { error, value } = ReportValidations
        .validate(ReportValidations.ValidationTypes.REPORT_WORKORDER_SCHEMA, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        try {
            EmployeeModel
                .find({ WorkOrder: value.WOID })
                .populate('Gender')
                .populate({
                    path: 'WorkOrder',
                    populate: {
                        path: 'workOrderRoles',
                        populate: {
                            path: 'role'
                        }
                    },
                })
                .populate({
                    path: 'WorkOrder',
                    populate: {
                        path: 'client'
                    }
                })
                .populate({
                    path: 'WorkOrderRole',
                    populate: {
                        path: 'role'
                    }
                })

                .exec((err, Empresult) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ success: true, message: 'Internal server error' })
                    }

                    let EmployeeIDS = Empresult.map((ele) => ele._id);

                    AttendanceModel
                        .find({ Employee: EmployeeIDS, Month: value.SelectedMonth, Year: value.SelectedYear })
                        .exec(async (err, Attndresult) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .send({ success: false, message: 'Internal server error' });
                            }

                            var employeeData = {
                                EmpData: Empresult,
                                AttndData: Attndresult
                            }


                            if (Attndresult && Attndresult.length > 0) {
                                const transformed = [];

                                Empresult.forEach((empData, ix) => {
                                    let AttndData = (Attndresult && Attndresult.length > 0) ?
                                        Attndresult.filter(ee => {
                                            let AttndEmpID = ee.Employee.toString();
                                            let EmpID = empData._id.toString();
                                            return AttndEmpID == EmpID;
                                        }) : [];
                                    if (AttndData && AttndData.length >= 0) {
                                        var resultData = {
                                            _id: empData._id,
                                            UniqueEmpId: empData.UniqueEmpId,
                                            FullName: empData.FullName,
                                            Month: AttndData[0] ? AttndData[0].Month : '-',
                                            Year: AttndData[0] ? AttndData[0].Year : '-',
                                            DateOfExit: empData.DateOfExit,
                                            DateOfJoining: empData.DateOfJoining,
                                            NoOfDaysWorked: AttndData[0] ? AttndData[0].NoOfDaysWorked : '0',
                                            NoOfLeaves: AttndData[0] ? AttndData[0].NoOfLeaves : '0',
                                            NoOfOTDays: AttndData[0] ? AttndData[0].NoOfOTDays : '0',
                                            AccountNumber: empData.AccountNumber,
                                            IFSC: empData.IFSC,
                                            Branch: empData.Branch,
                                            WorkOrderRole: {
                                                branchName: empData.WorkOrderRole.branchName,
                                                siteAddress: empData.WorkOrderRole.siteAddress,
                                                role: {
                                                    name: empData.WorkOrderRole.role.name
                                                },
                                            },
                                            WorkOrder: {
                                                name: empData.WorkOrder.name,
                                                client: {
                                                    name: empData.WorkOrder.client.name
                                                },
                                            },
                                            Gender: {
                                                name: empData.Gender.name
                                            },
                                            ParentName: empData.ParentName,
                                            SpouseName: empData.SpouseName,
                                            DateOfBirth: empData.DateOfBirth,
                                            ReasonForExit: empData.ReasonForExit,
                                            PresentAddress: empData.PresentAddress,
                                            PresentAddressPincode: empData.PresentAddressPincode,
                                            PresentAddressPhone: empData.PresentAddressPhone,
                                            PermanentAddress: empData.PermanentAddress,
                                            PermanentAddressPincode: empData.PermanentAddressPincode,
                                            PermanentAddressPhone: empData.PermanentAddressPhone,
                                            AadharNo: empData.AadharNo,
                                            PAN: empData.PAN,
                                            UniversalAccount: empData.UniversalAccount,
                                            PFAccount: empData.PFAccount,
                                            ESI: empData.ESI,
                                            EMail: empData.EmailId,
                                            PlaceOfBirth: empData.PlaceOfBirth,
                                            GrossSalary: empData.GrossSalary,
                                            Status: empData.Status,
                                        }

                                        transformed.push(resultData)
                                    }
                                })

                                return res
                                    .status(200)
                                    .send({ success: true, data: transformed })
                            }
                            else {
                                return res
                                    .status(200)
                                    .send({ success: false, messege: "Attendance Details are not available for this month and year, Please select a valid month and year." })
                            }

                        })
                })

        }
        catch (error) {
            return res
                .status(500)
                .send({ success: false, message: 'Internal server error' });
        }
    }
}

exports.getEmpReportByClient = async function (req, res) {
    const { error, value } = ReportValidations
        .validate(ReportValidations.ValidationTypes.REPORT_CLIENT_SCHEMA, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        try {

            WorkOrderModel
                .find({ client: value.ClientID })
                .populate('client')
                .populate({
                    path: 'workOrderRoles',
                    populate: {
                        path: 'role'
                    }
                })
                .exec((err, ClientResult) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ success: true, message: 'Internal server error' })
                    }

                    let ClientResultIDS = ClientResult.map((ele) => ele._id);

                    EmployeeModel
                        .find({ WorkOrder: ClientResultIDS })
                        .populate('Gender')
                        .populate({
                            path: 'WorkOrder',
                            populate: {
                                path: 'workOrderRoles',
                                populate: {
                                    path: 'role'
                                }
                            },
                        })
                        .populate({
                            path: 'WorkOrder',
                            populate: {
                                path: 'client'
                            }
                        })
                        .populate({
                            path: 'WorkOrderRole',
                            populate: {
                                path: 'role'
                            }
                        })

                        .exec((err, Empresult) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .send({ success: true, message: 'Internal server error' })
                            }

                            let EmployeeIDS = Empresult.map((ele) => ele._id);

                            AttendanceModel
                                .find({ Employee: EmployeeIDS, Month: value.SelectedMonth, Year: value.SelectedYear })
                                .exec(async (err, Attndresult) => {
                                    if (err) {
                                        return res
                                            .status(500)
                                            .send({ success: false, message: 'Internal server error' });
                                    }

                                    var employeeData = {
                                        EmpData: Empresult,
                                        AttndData: Attndresult
                                    }


                                    if (Attndresult && Attndresult.length > 0) {
                                        const transformed = [];

                                        Empresult.forEach((empData, ix) => {
                                            let AttndData = (Attndresult && Attndresult.length > 0) ?
                                                Attndresult.filter(ee => {
                                                    let AttndEmpID = ee.Employee.toString();
                                                    let EmpID = empData._id.toString();
                                                    return AttndEmpID == EmpID;
                                                }) : [];
                                            if (AttndData && AttndData.length >= 0) {
                                                var resultData = {
                                                    _id: empData._id,
                                                    UniqueEmpId: empData.UniqueEmpId,
                                                    FullName: empData.FullName,
                                                    Month: AttndData[0] ? AttndData[0].Month : '-',
                                                    Year: AttndData[0] ? AttndData[0].Year : '-',
                                                    DateOfExit: empData.DateOfExit,
                                                    DateOfJoining: empData.DateOfJoining,
                                                    NoOfDaysWorked: AttndData[0] ? AttndData[0].NoOfDaysWorked : '0',
                                                    NoOfLeaves: AttndData[0] ? AttndData[0].NoOfLeaves : '0',
                                                    NoOfOTDays: AttndData[0] ? AttndData[0].NoOfOTDays : '0',
                                                    AccountNumber: empData.AccountNumber,
                                                    IFSC: empData.IFSC,
                                                    Branch: empData.Branch,
                                                    WorkOrderRole: {
                                                        branchName: empData.WorkOrderRole.branchName,
                                                        siteAddress: empData.WorkOrderRole.siteAddress,
                                                        role: {
                                                            name: empData.WorkOrderRole.role.name
                                                        },
                                                    },
                                                    WorkOrder: {
                                                        name: empData.WorkOrder.name,
                                                        client: {
                                                            name: empData.WorkOrder.client.name
                                                        },
                                                    },
                                                    Gender: {
                                                        name: empData.Gender.name
                                                    },
                                                    ParentName: empData.ParentName,
                                                    SpouseName: empData.SpouseName,
                                                    DateOfBirth: empData.DateOfBirth,
                                                    ReasonForExit: empData.ReasonForExit,
                                                    PresentAddress: empData.PresentAddress,
                                                    PresentAddressPincode: empData.PresentAddressPincode,
                                                    PresentAddressPhone: empData.PresentAddressPhone,
                                                    PermanentAddress: empData.PermanentAddress,
                                                    PermanentAddressPincode: empData.PermanentAddressPincode,
                                                    PermanentAddressPhone: empData.PermanentAddressPhone,
                                                    AadharNo: empData.AadharNo,
                                                    PAN: empData.PAN,
                                                    UniversalAccount: empData.UniversalAccount,
                                                    PFAccount: empData.PFAccount,
                                                    ESI: empData.ESI,
                                                    EMail: empData.EmailId,
                                                    PlaceOfBirth: empData.PlaceOfBirth,
                                                    GrossSalary: empData.GrossSalary,
                                                    Status: empData.Status,
                                                }

                                                transformed.push(resultData)
                                            }
                                        })

                                        return res
                                            .status(200)
                                            .send({ success: true, data: transformed })
                                    }
                                    else {
                                        return res
                                            .status(200)
                                            .send({ success: false, messege: "Attendance Details are not available for this month and year, Please select a valid month and year." })
                                    }

                                })
                        })

                });

        }
        catch (error) {
            return res
                .status(500)
                .send({ success: false, message: 'Internal server error' });
        }
    }
}
