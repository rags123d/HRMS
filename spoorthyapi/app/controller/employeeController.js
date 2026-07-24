const EmployeeModel = require('../model/employee');
const GeneralUtils = require('../utils/generalUtils');
const EmployeeValidations = require('../validations/employeeValidations');
const FamilyDetailModel = require('../model/familyDetail');
const EducationalQualificationModel = require('../model/educationalQualification');
const WorkExperienceModel = require('../model/workExperience');
const LanguagesKnownModel = require('../model/languagesKnown');
const ReferencesModel = require('../model/references');
const WorkOrderModel = require('../model/workOrder');
const WorkOrderRoleModel = require('../model/workOrderRole');
const FeedbackModel = require('../model/feedback')
const UserModel = require('../model/user')
const Enum = require('../constants/enum')
const jwt = require('jsonwebtoken');
var fs = require('fs');
const DashboardValidations = require('../validations/dashboardValidations');
const GenderModel = require('../model/gender');
const MaritalStatusModel = require('../model/maritalStatus');
const ReligionModel = require('../model/religion');
const BloodGroupModel = require('../model/bloodGroup');
const LanguageModel = require('../model/language');
const DesignationModel = require('../model/designation');
const CourseModel = require('../model/course');
const RelationshipModel = require('../model/relationship');
const RoleModel = require('../model/role');
const ClientModel = require('../model/client');
const EmployeeLogsModel = require('../model/employeeLogs');
const moment = require('moment');
const sharedUsers = require('../model/sharedUsers');

exports.getEmployee = async function (req, res) {
    const { error, value } = DashboardValidations
        .validate(DashboardValidations.ValidationTypes.DASHBOARD_LISTING_SCHEMA, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        EmployeeModel
            .find({ isDeleted: false })
            .populate('Gender')
            .populate('MaritalStatus')
            .populate('Religion')
            .populate('BloodGroup')
            .populate({
                path: 'FamilyDetail',
                populate: {
                    path: 'Relationship'
                }
            })
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
                path: 'EducationalQualification',
                populate: {
                    path: 'Course'
                }
            })
            .populate({
                path: 'WorkExperience',
                // populate: {
                //     path: 'Designation'
                // }
            })
            .populate({
                path: 'LanguagesKnown',
                populate: {
                    path: 'Language'
                }
            })
            .populate({
                path: 'References',
                // populate: {
                //     path: 'Occupation'
                // }
            })
            .populate({
                path: 'WorkOrderRole',
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
}

exports.getPostEmployee = async function (req, res) {
    const { error, value } = DashboardValidations
        .validate(DashboardValidations.ValidationTypes.DASHBOARD_LISTING_SCHEMA, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {

        EmployeeModel
            .find({ isDeleted: false })
            .populate('Gender')
            .populate('MaritalStatus')
            .populate('Religion')
            .populate('BloodGroup')
            .populate({
                path: 'FamilyDetail',
                populate: {
                    path: 'Relationship'
                }
            })
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
                path: 'EducationalQualification',
                populate: {
                    path: 'Course'
                }
            })
            .populate({
                path: 'WorkExperience',
                // populate: {
                //     path: 'Designation'
                // }
            })
            .populate({
                path: 'LanguagesKnown',
                populate: {
                    path: 'Language'
                }
            })
            .populate({
                path: 'References',
                // populate: {
                //     path: 'Occupation'
                // }
            })
            .populate({
                path: 'WorkOrderRole',
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
                // return res
                //     .status(200)
                //     .send({ success: true, data: result })


                let searchText = value.searchText;
                if (searchText && searchText.length > 1) {
                    searchText = searchText.toString().toLowerCase();
                    result = result.filter(item => {
                        return (item.FullName && item.FullName.toLowerCase().indexOf(searchText) !== -1) ||
                            (item.PresentAddressPhone && item.PresentAddressPhone.toLowerCase().indexOf(searchText) !== -1) ||
                            (item.PermanentAddressPhone && item.PermanentAddressPhone.toLowerCase().indexOf(searchText) !== -1) ||
                            (item.UniqueEmpId && item.UniqueEmpId.toLowerCase().indexOf(searchText) !== -1) ||
                            (item.WorkOrder && item.WorkOrder.client && item.WorkOrder.client.name.toLowerCase().indexOf(searchText) !== -1) || !searchText;
                    });
                }

                let resdata = (result && result.length > 0) ? result.slice((value.skip ? value.skip : 0), (value.skip ? value.skip : 0) + (value.limit ? value.limit : 10)) : [];
                return res
                    .status(200)
                    .send({
                        success: true,
                        data: {
                            result: resdata,
                            total: (result && result.length > 0) ? result.length : 0
                        }
                    });

            })
    }
}

exports.getPostEmployeeFilter = async function (req, res) {
    const { error, value } = DashboardValidations
        .validate(DashboardValidations.ValidationTypes.DASHBOARD_LISTING_FILTER_SCHEMA, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        const query = {}
        if (value.filter == Enum.APPLICATION_FILTER_TYPES.HIRED) {
            query.Status = Enum.EMPLOYEE_STATUS.HIRED
        } else if (value.filter == Enum.APPLICATION_FILTER_TYPES.REJECTED) {
            query.Status = Enum.EMPLOYEE_STATUS.REJECTED
        } else if (value.filter == Enum.APPLICATION_FILTER_TYPES.UNDER_GM_APPROVAL) {
            query.Status = Enum.EMPLOYEE_STATUS.UNDER_GM_APPROVAL
        } else if (value.filter == Enum.APPLICATION_FILTER_TYPES.UNDER_MD_APPROVAL) {
            query.Status = Enum.EMPLOYEE_STATUS.UNDER_MD_APPROVAL
        }


        const fromDate = new Date(value.fromDate);
        fromDate.setHours(0, 0, 0);
        const toDate = new Date(value.toDate);
        toDate.setHours(23, 59, 59);

        console.log('fromDate:', fromDate);
        console.log('toDate:', toDate);

        if (value.fromDate && value.toDate) {
            // query.createdAt = {
            //     $gte: new Date(value.fromDate),
            //     $lte: new Date(value.toDate)
            // }
            query.DateOfJoining = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            }
        }
        //query.isDeleted = false;

        EmployeeModel
            // .find(
            //     query,
            //     { createdAt: { $gte: new Date(value.fromDate), $lte: new Date(value.toDate) } },
            //     { isDeleted: false })
            //.find( { query })
            .find({
                Status: value.filter === '' ? { $ne: value.filter } : value.filter,
                DateOfJoining: { $gte: new Date(fromDate), $lte: new Date(toDate) },
                isDeleted: false
            })
            .populate('Gender')
            .populate('MaritalStatus')
            .populate('Religion')
            .populate('BloodGroup')
            .populate({
                path: 'FamilyDetail',
                populate: {
                    path: 'Relationship'
                }
            })
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
                path: 'EducationalQualification',
                populate: {
                    path: 'Course'
                }
            })
            .populate({
                path: 'WorkExperience',
                // populate: {
                //     path: 'Designation'
                // }
            })
            .populate({
                path: 'LanguagesKnown',
                populate: {
                    path: 'Language'
                }
            })
            .populate({
                path: 'References',
                // populate: {
                //     path: 'Occupation'
                // }
            })
            .populate({
                path: 'WorkOrderRole',
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
                // return res
                //     .status(200)
                //     .send({ success: true, data: result })


                let searchText = value.searchText;
                if (searchText && searchText.length > 1) {
                    searchText = searchText.toString().toLowerCase();
                    result = result.filter(item => {
                        return (item.FullName && item.FullName.toLowerCase().indexOf(searchText) !== -1) ||
                            (item.PresentAddressPhone && item.PresentAddressPhone.toLowerCase().indexOf(searchText) !== -1) ||
                            (item.PermanentAddressPhone && item.PermanentAddressPhone.toLowerCase().indexOf(searchText) !== -1) ||
                            (item.UniqueEmpId && item.UniqueEmpId.toLowerCase().indexOf(searchText) !== -1) ||
                            (item.WorkOrder && item.WorkOrder.client && item.WorkOrder.client.name.toLowerCase().indexOf(searchText) !== -1) || !searchText;
                    });
                }

                let resdata = (result && result.length > 0) ? result.slice((value.skip ? value.skip : 0), (value.skip ? value.skip : 0) + (value.limit ? value.limit : 10)) : [];
                return res
                    .status(200)
                    .send({
                        success: true,
                        data: {
                            result: resdata,
                            total: (result && result.length > 0) ? result.length : 0
                        }
                    });

            })
    }
}

exports.getEmployeeById = async function (req, res) {
    const { error, value } = EmployeeValidations
        .validate(EmployeeValidations.ValidationTypes.EMPLOYEE_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    await EmployeeModel
        .findOne({ _id: value.id })
        .populate('Gender')
        .populate('MaritalStatus')
        .populate('Religion')
        .populate('BloodGroup')
        .populate('Attendance')
        .populate('Feedback')
        .populate({
            path: 'FamilyDetail',
            populate: {
                path: 'Relationship'
            }
        })
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
            path: 'EducationalQualification',
            populate: {
                path: 'Course'
            }
        })
        .populate({
            path: 'WorkExperience',
            // populate: {
            //     path: 'Designation'
            // }
        })
        .populate({
            path: 'LanguagesKnown',
            populate: {
                path: 'Language'
            }
        })
        .populate({
            path: 'References',
            // populate: {
            //     path: 'Occupation'
            // }
        })
        .populate({
            path: 'WorkOrderRole',
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

exports.getHiredEmployee = async function (req, res) {
    EmployeeModel
        .find({ isDeleted: false, IsEmployee: true, Status: Enum.EMPLOYEE_STATUS.HIRED })
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

exports.getAllCientwiseHiredEmp = async function (req, res) {
    EmployeeModel
        .find({ isDeleted: false, IsEmployee: true, Status: Enum.EMPLOYEE_STATUS.HIRED })
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
        .exec((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: true, message: 'Internal server error' })
            }
            // return res
            //     .status(200)
            //     .send({ success: true, data: result })

            let searchText = req.body.searchText;
            if (searchText && searchText.length > 1) {
                searchText = searchText.toString().toLowerCase();
                result = result.filter(item => {
                    return (item.WorkOrder.client.name && item.WorkOrder.client.name.toLowerCase().indexOf(searchText) !== -1) || !searchText;
                });
            }

            let resdata = (result && result.length > 0) ? result.slice((req.body.skip ? req.body.skip : 0), (req.body.skip ? req.body.skip : 0) + (req.body.limit ? req.body.limit : 10)) : [];
            return res
                .status(200)
                .send({
                    success: true,
                    data: {
                        result: resdata,
                        total: (result && result.length > 0) ? result.length : 0
                    }
                });

        })
}

exports.getRejectedEmployee = async function (req, res) {
    EmployeeModel
        .find({ isDeleted: false, Status: Enum.EMPLOYEE_STATUS.REJECTED })
        .populate('Gender')
        .populate('MaritalStatus')
        .populate('Religion')
        .populate('BloodGroup')
        .populate({
            path: 'FamilyDetail',
            populate: {
                path: 'Relationship'
            }
        })
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
            path: 'EducationalQualification',
            populate: {
                path: 'Course'
            }
        })
        .populate({
            path: 'WorkExperience',
            // populate: {
            //     path: 'Designation'
            // }
        })
        .populate({
            path: 'LanguagesKnown',
            populate: {
                path: 'Language'
            }
        })
        .populate({
            path: 'References',
            // populate: {
            //     path: 'Occupation'
            // }
        })
        .populate({
            path: 'WorkOrderRole',
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

exports.getEmployeeByWorkOrder = async function (req, res) {
    const { error, value } = EmployeeValidations
        .validate(EmployeeValidations.ValidationTypes.WORKORDER_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        EmployeeModel
            .find({ isDeleted: false, IsEmployee: true, Status: Enum.EMPLOYEE_STATUS.HIRED, WorkOrder: value.id })
            .populate('Gender')
            .populate('MaritalStatus')
            .populate('Religion')
            .populate('BloodGroup')
            .populate({
                path: 'FamilyDetail',
                populate: {
                    path: 'Relationship'
                }
            })
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
                path: 'EducationalQualification',
                populate: {
                    path: 'Course'
                }
            })
            .populate({
                path: 'WorkExperience',
                // populate: {
                //     path: 'Designation'
                // }
            })
            .populate({
                path: 'LanguagesKnown',
                populate: {
                    path: 'Language'
                }
            })
            .populate({
                path: 'References',
                // populate: {
                //     path: 'Occupation'
                // }
            })
            .populate({
                path: 'WorkOrderRole',
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
}

exports.addFeedback = async function (req, res) {
    const { error, value } = EmployeeValidations
        .validate(EmployeeValidations.ValidationTypes.EMPLOYEE_ADD_FEEDBACK, req.body)

    if (error) {
        if (req.files.FeedbackPhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.FeedbackPhoto[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    } else if (!req.files.FeedbackPhoto) {
        return res
            .status(400)
            .send({ success: false, message: 'FeedbackPhoto is required' });
    }
    try {

        await EmployeeModel
            .findOne({ _id: value.id })
            .exec(async (err, employee) => {
                if (err) {
                    if (req.files.FeedbackPhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.FeedbackPhoto[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: "Internal server error" })
                } else if (!employee) {
                    if (req.files.FeedbackPhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.FeedbackPhoto[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: "Internal server error" })
                }

                var FeedbackDetail = {
                    Type: value.Type,
                    FeedbackRemarks: value.FeedbackRemarks,
                    SubmittedBy: value.SubmittedBy
                }

                var FeedbackData = new FeedbackModel(FeedbackDetail);
                await FeedbackData.save(async (err, feedback) => {
                    if (err) {
                        if (req.files.FeedbackPhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.FeedbackPhoto[0].filename) }
                        return res
                            .status(500)
                            .send({ success: false, message: 'Internal server error' });
                    }

                    if (!fs.existsSync('./public/uploads/candidate/' + employee._id + '/Feedback')) {
                        fs.mkdirSync('./public/uploads/candidate/' + employee._id + '/Feedback', { recursive: true });
                    }

                    if (req.files.FeedbackPhoto
                        && req.files.FeedbackPhoto.length
                        && req.files.FeedbackPhoto[0]) {
                        FeedbackData['FeedbackPhoto'] = 'uploads/candidate/' + employee._id + '/Feedback/' + req.files.FeedbackPhoto[0].filename;
                    }

                    if (feedback && feedback._id) {
                        employee.Feedback.push(feedback._id)
                    }

                    await EmployeeModel.updateOne({ _id: value.id }, { $set: employee })
                    await FeedbackModel
                        .updateOne({ _id: FeedbackData._id }, { $set: FeedbackData })
                        .exec(async (err, result1) => {
                            if (err) {
                                if (req.files.FeedbackPhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.FeedbackPhoto[0].filename) }
                                return res
                                    .status(500)
                                    .send({ success: false, message: 'Internal server error' })
                            }

                            if (req.files.FeedbackPhoto
                                && req.files.FeedbackPhoto.length
                                && req.files.FeedbackPhoto[0]) {
                                move('./public/uploads/candidate/' + req.files.FeedbackPhoto[0].filename, './public/uploads/candidate/' + employee._id + '/Feedback/' + req.files.FeedbackPhoto[0].filename);
                            }

                            return res
                                .status(200)
                                .send({ success: true, message: "Feedback Added", data: feedback })
                        })
                })
            })

    } catch (err) {
        if (req.files.UploadedPhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.UploadedPhoto[0].filename) }
        console.log("error - controller ", error);
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' });
    }

}

exports.addBankDetails = async function (req, res) {
    const { error, value } = EmployeeValidations
        .validate(EmployeeValidations.ValidationTypes.EMPLOYEE_BANK_REGISTER, req.body)

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    var EmployeeBankDetail = {
        BankName: value.BankName,
        Branch: value.Branch,
        AccountNumber: value.AccountNumber,
        IFSC: value.IFSC,
        IsBankDetailAdded: true
    }

    try {
        var employee = await EmployeeModel.findOne({ _id: value.id }).countDocuments();
        if (employee == 0) {
            return res
                .status(500)
                .send({ success: false, message: 'Employee does not exist!' });
        }

        await EmployeeModel.updateOne({ _id: value.id }, { $set: EmployeeBankDetail })
        const EmployeeModelData = await EmployeeModel
            .findOne({ _id: value.id })
            .populate('FamilyDetail')
            .populate('WorkOrder')
            .populate('EducationalQualification')
            .populate('WorkExperience')
            .populate('LanguagesKnown')
            .populate('References')

        return res
            .status(200)
            .send({ success: true, message: 'Employee Bank Details updated Successfully', data: EmployeeModelData })
    }
    catch {
        console.log("error - controller ", error);
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' });
    }
}


exports.addESIPFDetails = async function (req, res) {
    const { error, value } = EmployeeValidations
        .validate(EmployeeValidations.ValidationTypes.EMPLOYEE_ESIPF_UPDATE, req.body)

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    var EmployeeESIPFDetail = {
        PFAccount: value.PFAccount,
        UniversalAccount: value.UniversalAccount,
        ESI: value.ESI,
        SchemeCertificate: value.SchemeCertificate,
        PPONumber: value.PPONumber,
        NonContributoryPeriod: value.NonContributoryPeriod,
        IsESIPFAdded: true
    }

    try {
        var employee = await EmployeeModel.findOne({ _id: value.id }).countDocuments();
        if (employee == 0) {
            return res
                .status(500)
                .send({ success: false, message: 'Employee does not exist!' });
        }

        await EmployeeModel.updateOne({ _id: value.id }, { $set: EmployeeESIPFDetail })
        const EmployeeModelData = await EmployeeModel
            .findOne({ _id: value.id })
            .populate('FamilyDetail')
            .populate('WorkOrder')
            .populate('EducationalQualification')
            .populate('WorkExperience')
            .populate('LanguagesKnown')
            .populate('References')

        return res
            .status(200)
            .send({ success: true, message: 'Employee ESIPF Details updated Successfully', data: EmployeeModelData })
    }
    catch {
        console.log("error - controller ", error);
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' });
    }
}

exports.addEditEmployee = async function (req, res) {
    const { error, value } = EmployeeValidations
        .validate(EmployeeValidations.ValidationTypes.EMPLOYEE_REGISTER, req.body);

    if (error) {
        if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
        if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
        if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
        if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
        if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
        if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
        if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
        if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else if (!req.files.CandidatePhoto) {
        if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
        if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
        if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
        if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
        if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
        if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
        if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: 'CandidatePhoto is required' });
    }
    else if (!req.files.AadharDocument) {
        if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
        if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
        if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
        if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
        if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
        if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
        if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: 'AadharDocument is required' });
    }
    else if (!req.files.PassbookDocument) {
        if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
        if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
        if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
        if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
        if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
        if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
        if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: 'PassbookDocument is required' });
    }
    else {

        try {
            var _WorkOrder = await WorkOrderModel.findOne({ _id: value.WorkOrder });
            var _WorkOrderData = {};
            const user = req.decoded.user;
            if (user && user.role && user.role == Enum.ADMIN_ROLE.HR) {
                if (!_WorkOrder) {
                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: 'WorkOrder not found' });
                }
                else {
                    // var underapproval = 0;
                    // if (_WorkOrder.underapproval > 0) {
                    //     _WorkOrderData = { underapproval: (_WorkOrder.underapproval + 1) }
                    // }
                    // else {
                    //     _WorkOrderData = { underapproval: (underapproval + 1) }
                    // }

                    if (_WorkOrder.underapproval) {
                        _WorkOrderData = { underapproval: (_WorkOrder.underapproval + 1) }
                    }
                    else {
                        _WorkOrderData = { underapproval: 1 }
                    }
                }
            }

            var _WorkOrderRoleData = {};
            if (user && user.role && user.role == Enum.ADMIN_ROLE.HR) {


                var _WorkOrderRole = await WorkOrderRoleModel.findOne({ _id: value.WorkOrderRole });
                var WORoleAvaiVacancy = (_WorkOrderRole.noOfManpower - _WorkOrderRole.hired) > 0;

                if (!(WORoleAvaiVacancy > 0)) {
                    return res
                        .status(400)
                        .send({ success: false, message: 'No Available vacancy For Particular Role on this Clients WorkOrder Role' });
                }

                if (!_WorkOrderRole) {
                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: 'WorkOrderRole not found' });
                }
                else {
                    // var underapproval = 0;
                    // if (_WorkOrderRole.underapproval > 0) {
                    //     _WorkOrderRoleData = { underapproval: (_WorkOrderRole.underapproval + 1) }
                    // }
                    // else {
                    //     _WorkOrderRoleData = { underapproval: (underapproval + 1) }
                    // }

                    if (_WorkOrderRole.underapproval) {
                        _WorkOrderRoleData = { underapproval: (_WorkOrderRole.underapproval + 1) }
                    }
                    else {
                        _WorkOrderRoleData = { underapproval: 1 }
                    }
                }
            }

            if (req.body.FamilyDetail) {
                const { success, message } = await EmployeeValidations.validateFamilyDetail(req.body.FamilyDetail);
                if (!success) {
                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: message });
                }
            }

            if (req.body.EducationalQualification) {
                const { success, message } = await EmployeeValidations.validateEducationalQualification(req.body.EducationalQualification);
                if (!success) {
                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: message });
                }
            }

            if (req.body.WorkExperience && req.body.WorkExperienceType == "EXPERIENCED") {
                const { success, message } = await EmployeeValidations.validateWorkExperience(req.body.WorkExperience);
                if (!success) {
                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: message });
                }
            }

            if (req.body.LanguagesKnown) {
                const { success, message } = await EmployeeValidations.validateLanguagesKnown(req.body.LanguagesKnown);
                if (!success) {
                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: message });
                }
            }

            if (req.body.References && req.body.WorkExperienceType == "EXPERIENCED") {
                const { success, message } = await EmployeeValidations.validateReferences(req.body.References);
                if (!success) {
                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: message });
                }
            }

            var FamilyDetailIds = [];
            if (req.body.FamilyDetail) {
                req.body.FamilyDetail = JSON.parse(req.body.FamilyDetail);
                if (Array.isArray(req.body.FamilyDetail) && req.body.FamilyDetail.length > 0) {
                    for (const Member of req.body.FamilyDetail) {
                        const MemberData = {
                            Relationship: Member.Relationship,
                            Name: Member.Name,
                            DateOfBirth: Member.DateOfBirth,
                            Age: Member.Age,
                            ContactNo: Member.ContactNo,
                            AadharNo: Member.AadharNo
                        }
                        if (Member.id) {
                            FamilyDetailIds.push(Member.id)
                            await FamilyDetailModel.updateOne({ _id: Member.id }, { $set: MemberData })
                        } else {
                            const FamilyDetailData = new FamilyDetailModel(MemberData);
                            const result = await FamilyDetailData.save();
                            if (result && result._id) {
                                FamilyDetailIds.push(result._id)
                            }
                        }
                    }
                }
            }

            var EducationalQualificationIds = [];
            if (req.body.EducationalQualification) {
                req.body.EducationalQualification = JSON.parse(req.body.EducationalQualification);
                if (Array.isArray(req.body.EducationalQualification) && req.body.EducationalQualification.length > 0) {
                    for (const EducationalQualification of req.body.EducationalQualification) {
                        const EducationalQualificationData = {
                            Course: EducationalQualification.Course,
                            SchoolCollegeName: EducationalQualification.SchoolCollegeName,
                            From: EducationalQualification.From,
                            To: EducationalQualification.To,
                            Marks: EducationalQualification.Marks,
                        }
                        if (EducationalQualification.id) {
                            EducationalQualificationIds.push(EducationalQualification.id)
                            await EducationalQualificationModel.updateOne({ _id: EducationalQualification.id }, { $set: EducationalQualificationData })
                        } else {
                            const _EducationalQualificationData = new EducationalQualificationModel(EducationalQualificationData);
                            const result = await _EducationalQualificationData.save();
                            if (result && result._id) {
                                EducationalQualificationIds.push(result._id)
                            }
                        }
                    }
                }
            }

            var WorkExperienceIds = [];
            if (req.body.WorkExperienceType == "EXPERIENCED" && req.body.WorkExperience) {
                req.body.WorkExperience = JSON.parse(req.body.WorkExperience);
                if (Array.isArray(req.body.WorkExperience) && req.body.WorkExperience.length > 0) {
                    for (const WorkExperience of req.body.WorkExperience) {
                        const WorkExperienceData = {
                            Designation: WorkExperience.Designation,
                            CompanyName: WorkExperience.CompanyName,
                            From: WorkExperience.From,
                            To: WorkExperience.To,
                            ExperienceYear: WorkExperience.ExperienceYear,
                            SalaryDrawn: WorkExperience.SalaryDrawn,
                            ReasonForLeaving: WorkExperience.ReasonForLeaving,
                            SupervisorName: WorkExperience.SupervisorName,
                            SupervisorMobile: WorkExperience.SupervisorMobile,
                            SupervisorEmail: WorkExperience.SupervisorEmail,
                        }
                        if (WorkExperience.id) {
                            WorkExperienceIds.push(WorkExperience.id)
                            await WorkExperienceModel.updateOne({ _id: WorkExperience.id }, { $set: WorkExperienceData })
                        } else {
                            const _WorkExperienceData = new WorkExperienceModel(WorkExperienceData);
                            const result = await _WorkExperienceData.save();
                            if (result && result._id) {
                                WorkExperienceIds.push(result._id)
                            }
                        }
                    }
                }
            }

            var LanguagesKnownIds = [];
            if (req.body.LanguagesKnown) {
                req.body.LanguagesKnown = JSON.parse(req.body.LanguagesKnown);
                if (Array.isArray(req.body.LanguagesKnown) && req.body.LanguagesKnown.length > 0) {
                    for (const LanguagesKnown of req.body.LanguagesKnown) {
                        const LanguagesKnownData = {
                            Language: LanguagesKnown.Language,
                            Speak: LanguagesKnown.Speak,
                            Read: LanguagesKnown.Read,
                            Write: LanguagesKnown.Write,
                        }
                        if (LanguagesKnown.id) {
                            LanguagesKnownIds.push(LanguagesKnown.id)
                            await LanguagesKnownModel.updateOne({ _id: LanguagesKnown.id }, { $set: LanguagesKnownData })
                        } else {
                            const _LanguagesKnownData = new LanguagesKnownModel(LanguagesKnownData);
                            const result = await _LanguagesKnownData.save();
                            if (result && result._id) {
                                LanguagesKnownIds.push(result._id)
                            }
                        }
                    }
                }
            }

            var ReferencesIds = [];
            if (req.body.WorkExperienceType == "EXPERIENCED" && req.body.References) {
                req.body.References = JSON.parse(req.body.References);
                if (Array.isArray(req.body.References) && req.body.References.length > 0) {
                    for (const References of req.body.References) {
                        const ReferencesData = {
                            Name: References.Name,
                            Occupation: References.Occupation,
                            Address: References.Address,
                            ContactNo: References.ContactNo,
                            AadharNo: References.AadharNo
                        }
                        if (References.id) {
                            ReferencesIds.push(References.id)
                            await ReferencesModel.updateOne({ _id: References.id }, { $set: ReferencesData })
                        } else {
                            const _ReferencesData = new ReferencesModel(ReferencesData);
                            const result = await _ReferencesData.save();
                            if (result && result._id) {
                                ReferencesIds.push(result._id)
                            }
                        }
                    }
                }
            }

            let isESIandPF = true;
            if ((value.UniversalAccount && value.PFAccount && value.ESI && value.SchemeCertificate && value.PPONumber && value.NonContributoryPeriod)) {
                isESIandPF = true;
            }
            else {
                isESIandPF = false;
            }

            let isBankData = true;
            if ((value.BankName && value.Branch && value.AccountNumber && value.IFSC)) {
                isBankData = true;
            }
            else {
                isBankData = false;
            }

            var EmployeeData = {
                FullName: value.FullName,
                ParentName: value.ParentName,
                EmailId: value.EmailId,
                SpouseName: value.SpouseName,
                DateOfBirth: value.DateOfBirth,
                PlaceOfBirth: value.PlaceOfBirth,
                Age: value.Age,
                Gender: value.Gender,
                MaritalStatus: value.MaritalStatus,
                Religion: value.Religion,
                MotherTongue: value.MotherTongue,
                BloodGroup: value.BloodGroup,
                PresentAddress: value.PresentAddress,
                PresentAddressPincode: value.PresentAddressPincode,
                PresentAddressPhone: value.PresentAddressPhone,
                PermanentAddress: value.PermanentAddress,
                PermanentAddressPincode: value.PermanentAddressPincode,
                PermanentAddressPhone: value.PermanentAddressPhone,
                Identification1: value.Identification1,
                Identification2: value.Identification2,
                Mark1: value.Mark1,
                Mark2: value.Mark2,
                AadharNo: value.AadharNo,
                PAN: value.PAN,
                GrossSalary: value.GrossSalary,
                NetSalary: value.NetSalary,
                DeductedSalary: value.DeductedSalary,
                FamilyDetail: FamilyDetailIds,
                WorkOrder: value.WorkOrder,
                EducationalQualification: EducationalQualificationIds,
                WorkExperience: WorkExperienceIds,
                LanguagesKnown: LanguagesKnownIds,
                References: ReferencesIds,
                WorkOrderRole: value.WorkOrderRole,
                DateOfJoining: value.DateOfJoining,
                DateOfExit: value.DateOfExit,
                ReasonForExit: value.ReasonForExit,
                // WorkOrderUnitBranch: value.WorkOrderUnitBranch,
                WorkExperienceType: value.WorkExperienceType,
                ESIBasedOn: value.ESIBasedOn,
                FetchFixation: value.FetchFixation,

                IsESIPFAdded: isESIandPF,
                UniversalAccount: value.UniversalAccount,
                PFAccount: value.PFAccount,
                ESI: value.ESI,
                SchemeCertificate: value.SchemeCertificate,
                PPONumber: value.PPONumber,
                NonContributoryPeriod: value.NonContributoryPeriod,

                IsBankDetailAdded: isBankData,
                BankName: value.BankName,
                Branch: value.Branch,
                AccountNumber: value.AccountNumber,
                IFSC: value.IFSC,

                BasicVDA: value.BasicVDA,
                benefitType: value.benefitType,
                Gratuity: value.Gratuity,
                MedicalAllowance: value.MedicalAllowance,
                RelieverCharges: value.RelieverCharges,
                Bonus: value.Bonus,
                HRA: value.HRA,
                NationalFestivalHolidays: value.NationalFestivalHolidays,
                Conveyance: value.Conveyance,
                LeaveWithWages: value.LeaveWithWages,
                WashingAllowance: value.WashingAllowance,
                SpecialAllowance: value.SpecialAllowance,

                deductionType: value.deductionType,
                PFAmount: value.PFAmount,
                ESIAmount: value.ESIAmount,
                ProfessionalTax: value.ProfessionalTax,

                CandidatePhoto: 'uploads/candidate/' + value.id + "/" + req.files.CandidatePhoto[0].filename,
                ResumeDocument: req.files.ResumeDocument ? 'uploads/candidate/' + value.id + "/" + req.files.ResumeDocument[0].filename : '',
                AadharDocument: 'uploads/candidate/' + value.id + "/" + req.files.AadharDocument[0].filename,
                PANDocument: req.files.PANDocument ? 'uploads/candidate/' + value.id + "/" + req.files.PANDocument[0].filename : '',
                AssessmentDocument: req.files.AssessmentDocument ? 'uploads/candidate/' + value.id + "/" + req.files.AssessmentDocument[0].filename : '',
                IDProofDocument: req.files.IDProofDocument ? 'uploads/candidate/' + value.id + "/" + req.files.IDProofDocument[0].filename : '',
                PassbookDocument: 'uploads/candidate/' + value.id + "/" + req.files.PassbookDocument[0].filename,
                QualificationDocument: req.files.QualificationDocument ? 'uploads/candidate/' + value.id + "/" + req.files.QualificationDocument[0].filename : ''
            }

            if (value.id) {
                EmployeeModel
                    .findOne({ _id: value.id })
                    .populate('WorkOrder')
                    .populate('WorkOrderRole')
                    .exec(async (err, result) => {

                        if (!result.UniqueEmpId) {
                            if ((+(result.EmployeeId)) < 10) {
                                var empid = "0000" + result.EmployeeId;
                                await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                            }
                            else if ((+(result.EmployeeId)) < 100) {
                                var empid = "000" + result.EmployeeId;
                                await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                            }
                            else if ((+(result.EmployeeId)) < 1000) {
                                var empid = "00" + result.EmployeeId;
                                await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                            }
                            else if ((+(result.EmployeeId)) < 10000) {
                                var empid = "0" + result.EmployeeId;
                                await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                            }
                            else if ((+(result.EmployeeId)) < 100000) {
                                var empid = result.EmployeeId;
                                await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                            }
                        }

                        if (!result.WorkOrder) {
                            await WorkOrderModel.updateOne({ _id: value.WorkOrder }, { $set: _WorkOrderData });
                        }

                        if (!result.WorkOrderRole) {
                            await WorkOrderRoleModel.updateOne({ _id: value.WorkOrderRole }, { $set: _WorkOrderRoleData });
                        }

                        if (err) {
                            if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                            if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                            if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                            if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                            if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                            if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                            if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                            if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                            return res
                                .status(500)
                                .send({ success: false, message: 'Internal server error' })
                        } else if (!result) {
                            if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                            if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                            if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                            if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                            if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                            if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                            if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                            if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                            return res
                                .status(400)
                                .send({ success: false, message: 'Invalid Id' })
                        } else {
                            var OldCandidatePhoto = result.CandidatePhoto;
                            var OldResumeDocument = result.ResumeDocument;
                            var OldAadharDocument = result.AadharDocument;
                            var OldPANDocument = result.PANDocument;
                            var OldAssessmentDocument = result.AssessmentDocument;
                            var OldIDProofDocument = result.IDProofDocument;
                            var OldPassbookDocument = result.PassbookDocument;
                            var OldQualificationDocument = result.QualificationDocument;

                            if (!fs.existsSync('./public/uploads/candidate/' + result._id)) {
                                fs.mkdirSync('./public/uploads/candidate/' + result._id, { recursive: true });
                            }

                            if (req.files.CandidatePhoto
                                && req.files.CandidatePhoto.length
                                && req.files.CandidatePhoto[0]) {
                                if (fs.existsSync('./public/' + OldCandidatePhoto)) { fs.unlinkSync('./public/' + OldCandidatePhoto) }
                                if (fs.existsSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename)) {
                                    move('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename, './public/uploads/candidate/' + result._id + "/" + req.files.CandidatePhoto[0].filename);
                                }
                                EmployeeData['CandidatePhoto'] = 'uploads/candidate/' + result._id + "/" + req.files.CandidatePhoto[0].filename;
                            }

                            if (req.files.ResumeDocument
                                && req.files.ResumeDocument.length
                                && req.files.ResumeDocument[0]) {
                                if (OldResumeDocument) {
                                    if (fs.existsSync('./public/' + OldResumeDocument)) { fs.unlinkSync('./public/' + OldResumeDocument) }
                                    if (fs.existsSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename)) {
                                        move('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename, './public/uploads/candidate/' + result._id + "/" + req.files.ResumeDocument[0].filename);
                                    }
                                }
                                EmployeeData['ResumeDocument'] = 'uploads/candidate/' + result._id + "/" + req.files.ResumeDocument[0].filename;
                            }

                            if (req.files.AadharDocument
                                && req.files.AadharDocument.length
                                && req.files.AadharDocument[0]) {
                                if (fs.existsSync('./public/' + OldAadharDocument)) { fs.unlinkSync('./public/' + OldAadharDocument) }
                                if (fs.existsSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename)) {
                                    move('./public/uploads/candidate/' + req.files.AadharDocument[0].filename, './public/uploads/candidate/' + result._id + "/" + req.files.AadharDocument[0].filename);
                                }
                                EmployeeData['AadharDocument'] = 'uploads/candidate/' + result._id + "/" + req.files.AadharDocument[0].filename;
                            }

                            if (req.files.PANDocument
                                && req.files.PANDocument.length
                                && req.files.PANDocument[0]) {
                                if (OldPANDocument) {
                                    if (fs.existsSync('./public/' + OldPANDocument)) { fs.unlinkSync('./public/' + OldPANDocument) }
                                    if (fs.existsSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename)) {
                                        move('./public/uploads/candidate/' + req.files.PANDocument[0].filename, './public/uploads/candidate/' + result._id + "/" + req.files.PANDocument[0].filename);
                                    }
                                }
                                EmployeeData['PANDocument'] = 'uploads/candidate/' + result._id + "/" + req.files.PANDocument[0].filename;
                            }

                            if (req.files.AssessmentDocument
                                && req.files.AssessmentDocument.length
                                && req.files.AssessmentDocument[0]) {
                                if (OldAssessmentDocument) {
                                    if (fs.existsSync('./public/' + OldAssessmentDocument)) { fs.unlinkSync('./public/' + OldAssessmentDocument) }
                                    if (fs.existsSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename)) {
                                        move('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename, './public/uploads/candidate/' + result._id + "/" + req.files.AssessmentDocument[0].filename);
                                    }
                                }
                                EmployeeData['AssessmentDocument'] = 'uploads/candidate/' + result._id + "/" + req.files.AssessmentDocument[0].filename;
                            }

                            if (req.files.IDProofDocument
                                && req.files.IDProofDocument.length
                                && req.files.IDProofDocument[0]) {
                                if (OldIDProofDocument) {
                                    if (fs.existsSync('./public/' + OldIDProofDocument)) { fs.unlinkSync('./public/' + OldIDProofDocument) }
                                    if (fs.existsSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename)) {
                                        move('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename, './public/uploads/candidate/' + result._id + "/" + req.files.IDProofDocument[0].filename);
                                    }
                                }
                                EmployeeData['IDProofDocument'] = 'uploads/candidate/' + result._id + "/" + req.files.IDProofDocument[0].filename;
                            }

                            if (req.files.PassbookDocument
                                && req.files.PassbookDocument.length
                                && req.files.PassbookDocument[0]) {
                                if (fs.existsSync('./public/' + OldPassbookDocument)) { fs.unlinkSync('./public/' + OldPassbookDocument) }
                                if (fs.existsSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename)) {
                                    move('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename, './public/uploads/candidate/' + result._id + "/" + req.files.PassbookDocument[0].filename);
                                }
                                EmployeeData['PassbookDocument'] = 'uploads/candidate/' + result._id + "/" + req.files.PassbookDocument[0].filename;
                            }

                            if (req.files.QualificationDocument
                                && req.files.QualificationDocument.length
                                && req.files.QualificationDocument[0]) {
                                if (OldQualificationDocument) {
                                    if (fs.existsSync('./public/' + OldQualificationDocument)) { fs.unlinkSync('./public/' + OldQualificationDocument) }
                                    if (fs.existsSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename)) {
                                        move('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename, './public/uploads/candidate/' + result._id + "/" + req.files.QualificationDocument[0].filename);
                                    }
                                }
                                EmployeeData['QualificationDocument'] = 'uploads/candidate/' + result._id + "/" + req.files.QualificationDocument[0].filename;
                            }

                            if (user && user.role && user.role != Enum.ADMIN_ROLE.FIELD_OFFICER) {

                                if (!(WORoleAvaiVacancy > 0)) {
                                    return res
                                        .status(400)
                                        .send({ success: false, message: 'No Available vacancy For Particular Role on this Clients WorkOrder Role' });
                                }

                                // if (value.WorkOrder != _WorkOrder._id) {
                                // await WorkOrderModel.updateOne({ _id: value.WorkOrder }, { $set: _WorkOrderData });
                                // }

                                // if (value.WorkOrderRole != _WorkOrderRole._id) {
                                // await WorkOrderRoleModel.updateOne({ _id: value.WorkOrderRole }, { $set: _WorkOrderRoleData });
                                // }

                                if (result.Status == "Hired" && oldWorkOrder != null && value.WorkOrder != oldWorkOrder._id) {
                                    if (result.DateOfJoining != undefined && moment(result.DateOfJoining).format('DD-MM-YYYY') == moment(value.DateOfJoining).format('DD-MM-YYYY')) {
                                        return res
                                            .status(400)
                                            .send({ success: false, message: 'Please change Date of joining' });
                                    }
                                    else if (result.Status == "Hired" && value.DateOfExit != null && value.ReasonForExit == '') {
                                        return res
                                            .status(400)
                                            .send({ success: false, message: 'Reason for exit is Required' });
                                    }
                                }

                                var oldWorkOrder = await WorkOrderModel.findOne({ _id: result.WorkOrder });
                                var oldWorkOrderRole = await WorkOrderRoleModel.findOne({ _id: result.WorkOrderRole });
                                if (oldWorkOrder != null) {
                                    var oldClient = await ClientModel.findOne({ _id: oldWorkOrder.client });
                                }

                                var empLogsData = await EmployeeLogsModel.findOne({ EmployeeID: result.UniqueEmpId, ClientData: result.WorkOrder })

                                if (oldWorkOrder != null && value.WorkOrder != oldWorkOrder._id) {
                                    var updateWorkOrderData = { underapproval: (_WorkOrder.underapproval + 1) }
                                    await WorkOrderModel.updateOne({ _id: _WorkOrder._id }, { $set: updateWorkOrderData });

                                    if (oldWorkOrder.underapproval > 0) {
                                        var updateWorkOrderDataOld = { underapproval: (oldWorkOrder.underapproval - 1) }
                                        await WorkOrderModel.updateOne({ _id: oldWorkOrder._id }, { $set: updateWorkOrderDataOld });
                                    }

                                    if (oldWorkOrder.hired > 0 && result.Status == "Hired") {
                                        var updateWorkOrderDataOld = { hired: (oldWorkOrder.hired - 1) }
                                        await WorkOrderModel.updateOne({ _id: oldWorkOrder._id }, { $set: updateWorkOrderDataOld });
                                    }

                                    if (result.Status == "Hired" && oldClient.hired > 0) {
                                        var updateClientData = { hired: (oldClient.hired - 1) }
                                        await ClientModel.updateOne({ _id: oldClient._id }, { $set: updateClientData });
                                    }

                                    if (result.Status == "Hired") {
                                        EmployeeData.ApprovedByGM = false;
                                        EmployeeData.ApprovedByMD = false;
                                        EmployeeData.IsEmployee = false;
                                        EmployeeData.Status = "Under GM Approval";
                                        EmployeeData.GMApprovedDate = '';
                                        EmployeeData.RemarksByGM = '';
                                        EmployeeData.MDApprovedDate = '';
                                        EmployeeData.RemarksByMD = '';
                                        EmployeeData.RejectionRemark = '';
                                        EmployeeData.HiredOn = '';
                                        EmployeeData.DateOfJoining = value.DateOfJoining;
                                        EmployeeData.DateOfExit = '';
                                        EmployeeData.ReasonForExit = '';

                                        EmployeeData.ViewStatus = [];
                                    }

                                    if (result.Status == "Hired" && value.DateOfJoining != result.DateOfJoining) {
                                        var joindate = value.DateOfJoining;
                                        var prvdate = new Date(joindate.setDate(joindate.getDate() - 1));
                                        console.log(prvdate);

                                        if (!(empLogsData) && result.Status == "Hired") {
                                            var EmployeeLogsData = {
                                                Employee: result._id,
                                                EmployeeID: result.UniqueEmpId,
                                                EmployeeName: result.FullName,
                                                Gender: result.Gender,
                                                GrossSalary: result.GrossSalary,
                                                NetSalary: result.NetSalary,
                                                DeductedSalary: result.DeductedSalary,
                                                ClientData: result.WorkOrder,
                                                WorkOrderData: result.WorkOrder,
                                                DateOfJoining: result.DateOfJoining,
                                                DateOfExit: result.DateOfExit,
                                                ReasonForExit: result.ReasonForExit,
                                            };

                                            var empLogsData = new EmployeeLogsModel(EmployeeLogsData);

                                            empLogsData.save((err, empHistory) => {
                                                if (err) {
                                                    return res
                                                        .status(500)
                                                        .send({ success: false, message: 'Internal server error' });
                                                }
                                            })
                                        }

                                        if (empLogsData != '') {
                                            if (empLogsData.DateOfExit == null && result.DateOfExit == null) {
                                                var updateData = { DateOfExit: prvdate, ReasonForExit: "Client/WorkOrder Updated" }
                                                await EmployeeLogsModel.updateOne({ _id: empLogsData.id }, { $set: updateData });
                                            }
                                            else {
                                                var updateData = { DateOfExit: result.DateOfExit, ReasonForExit: result.ReasonForExit }
                                                await EmployeeLogsModel.updateOne({ _id: empLogsData.id }, { $set: updateData });
                                            }
                                        }
                                    }
                                }

                                if (oldWorkOrderRole != null && value.WorkOrderRole != oldWorkOrderRole._id) {
                                    var updateWorkOrderRoleData = { underapproval: (_WorkOrderRole.underapproval + 1) }
                                    await WorkOrderRoleModel.updateOne({ _id: _WorkOrderRole._id }, { $set: updateWorkOrderRoleData });

                                    if (oldWorkOrderRole.underapproval > 0) {
                                        var updateWorkOrderRoleDataOld = { underapproval: (oldWorkOrderRole.underapproval - 1) }
                                        await WorkOrderRoleModel.updateOne({ _id: oldWorkOrderRole._id }, { $set: updateWorkOrderRoleDataOld });
                                    }

                                    if (oldWorkOrderRole.hired > 0 && result.Status == "Hired") {
                                        var updateWorkOrderRoleDataOld = { hired: (oldWorkOrderRole.hired - 1) }
                                        await WorkOrderRoleModel.updateOne({ _id: oldWorkOrderRole._id }, { $set: updateWorkOrderRoleDataOld });
                                    }
                                }

                                if (oldWorkOrder != null && result.Status == "Hired" && value.WorkOrder == oldWorkOrder._id) {
                                    if (result.DateOfJoining != value.DateOfJoining) {
                                        if (empLogsData.DateOfJoining != value.DateOfJoining) {
                                            var updateData = { DateOfJoining: value.DateOfJoining }
                                            await EmployeeLogsModel.updateOne({ _id: empLogsData.id }, { $set: updateData });
                                        }
                                    }

                                    if (value.DateOfExit) {
                                        if (empLogsData.DateOfExit == null) {
                                            var updateData = { DateOfExit: value.DateOfExit, ReasonForExit: value.ReasonForExit }
                                            await EmployeeLogsModel.updateOne({ _id: empLogsData.id }, { $set: updateData });
                                        }
                                    }
                                }
                            }

                            if ((value.GrossSalary != result.GrossSalary || value.WorkOrder != oldWorkOrder._id) && result.Status == "Hired") {
                                EmployeeData.InterviewDetail = [
                                    {
                                        Name: 'Interview By Field Officer & Candidate Registration',
                                        UpdatedOn: new Date(),
                                        SalarySet: value.GrossSalary,
                                        Status: "Approved",
                                        Documents: EmployeeData['AssessmentDocument']
                                    },
                                    {
                                        Name: 'Approved By General Manager',
                                        UpdatedOn: '-',
                                        SalarySet: '-',
                                        Status: "Pending",
                                        Remarks: "NA"
                                    },
                                    {
                                        Name: 'Approved By Managing Director',
                                        UpdatedOn: "-",
                                        SalarySet: "-",
                                        Status: "Pending",
                                        Remarks: "NA"
                                    }
                                ]
                            }

                            await EmployeeModel.updateOne({ _id: value.id }, { $set: EmployeeData })
                            const EmployeeModelData = await EmployeeModel
                                .findOne({ _id: value.id })
                                .populate('FamilyDetail')
                                .populate('WorkOrder')
                                .populate('EducationalQualification')
                                .populate('WorkExperience')
                                .populate('LanguagesKnown')
                                .populate('References')

                            return res
                                .status(200)
                                .send({ success: true, message: 'Employee details updated Successfully', data: EmployeeModelData })
                        }
                    })
            }
            else {
                var token = req.body.authorization || req.query.authorization || req.headers.authorization
                jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
                    if (err) {
                        return res
                            .status(401)
                            .send({ success: false, message: 'Failed to authenticate token' });
                    }

                    EmployeeData['RegisterDate'] = new Date();
                    var EmployeeModelData = new EmployeeModel(EmployeeData);
                    EmployeeModelData.save(async (err, result) => {

                        if ((+(result.EmployeeId)) < 10) {
                            var empid = "0000" + result.EmployeeId;
                            await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                        }
                        else if ((+(result.EmployeeId)) < 100) {
                            var empid = "000" + result.EmployeeId;
                            await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                        }
                        else if ((+(result.EmployeeId)) < 1000) {
                            var empid = "00" + result.EmployeeId;
                            await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                        }
                        else if ((+(result.EmployeeId)) < 10000) {
                            var empid = "0" + result.EmployeeId;
                            await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                        }
                        else if ((+(result.EmployeeId)) < 100000) {
                            var empid = result.EmployeeId;
                            await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                        }

                        if (err) {
                            if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                            if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                            if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                            if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                            if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                            if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                            if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                            if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                            return res
                                .status(500)
                                .send({ success: false, message: 'Internal server error' });
                        }

                        if (!fs.existsSync('./public/uploads/candidate/' + EmployeeModelData._id)) {
                            fs.mkdirSync('./public/uploads/candidate/' + EmployeeModelData._id, { recursive: true });
                        }

                        if (req.files.CandidatePhoto
                            && req.files.CandidatePhoto.length
                            && req.files.CandidatePhoto[0]) {
                            EmployeeModelData['CandidatePhoto'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.CandidatePhoto[0].filename;
                        }

                        if (req.files.ResumeDocument
                            && req.files.ResumeDocument.length
                            && req.files.ResumeDocument[0]) {
                            EmployeeModelData['ResumeDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.ResumeDocument[0].filename;
                        }

                        if (req.files.AadharDocument
                            && req.files.AadharDocument.length
                            && req.files.AadharDocument[0]) {
                            EmployeeModelData['AadharDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.AadharDocument[0].filename;
                        }

                        if (req.files.PANDocument
                            && req.files.PANDocument.length
                            && req.files.PANDocument[0]) {
                            EmployeeModelData['PANDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.PANDocument[0].filename;
                        }

                        if (req.files.AssessmentDocument
                            && req.files.AssessmentDocument.length
                            && req.files.AssessmentDocument[0]) {
                            EmployeeModelData['AssessmentDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.AssessmentDocument[0].filename;
                        }

                        if (req.files.IDProofDocument
                            && req.files.IDProofDocument.length
                            && req.files.IDProofDocument[0]) {
                            EmployeeModelData['IDProofDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.IDProofDocument[0].filename;
                        }

                        if (req.files.PassbookDocument
                            && req.files.PassbookDocument.length
                            && req.files.PassbookDocument[0]) {
                            EmployeeModelData['PassbookDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.PassbookDocument[0].filename;
                        }

                        if (req.files.QualificationDocument
                            && req.files.QualificationDocument.length
                            && req.files.QualificationDocument[0]) {
                            EmployeeModelData['QualificationDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.QualificationDocument[0].filename;
                        }

                        const user = decoded.user;
                        EmployeeModelData.ViewStatus = [
                            {
                                Title: Enum.APPROVAL_STATUS.FIELD_OFFICER,
                                Name: GeneralUtils.decrypt(user.userName),
                                Date: new Date()
                            },
                            {
                                Title: Enum.APPROVAL_STATUS.REGISTRATION,
                                Name: GeneralUtils.decrypt(user.userName),
                                Date: new Date()
                            },
                            {
                                Title: Enum.APPROVAL_STATUS.SELECTIONDISCLOSURE,
                                Name: GeneralUtils.decrypt(user.userName),
                                Date: new Date()
                            }
                        ]

                        EmployeeModelData.InterviewDetail = [
                            {
                                Name: 'Interview By Field Officer & Candidate Registration',
                                UpdatedOn: new Date(),
                                Status: "Approved"
                            },
                            {
                                Name: 'Salary Disclosure By HR',
                                UpdatedOn: new Date(),
                                SalarySet: value.GrossSalary,
                                Status: "Approved",
                                Documents: EmployeeModelData['AssessmentDocument']
                            },
                            {
                                Name: 'Approved By General Manager',
                                UpdatedOn: '-',
                                SalarySet: '-',
                                Status: "Pending",
                                Remarks: "NA"
                            },
                            {
                                Name: 'Approved By Managing Director',
                                UpdatedOn: "-",
                                SalarySet: "-",
                                Status: "Pending",
                                Remarks: "NA"
                            }
                        ]

                        await EmployeeModel
                            .updateOne({ _id: EmployeeModelData._id }, { $set: EmployeeModelData })
                            .exec(async (err, result1) => {
                                if (err) {
                                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' })
                                }

                                if (req.files.CandidatePhoto
                                    && req.files.CandidatePhoto.length
                                    && req.files.CandidatePhoto[0]) {
                                    move('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.CandidatePhoto[0].filename);
                                }

                                if (req.files.ResumeDocument
                                    && req.files.ResumeDocument.length
                                    && req.files.ResumeDocument[0]) {
                                    move('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.ResumeDocument[0].filename);
                                }

                                if (req.files.AadharDocument
                                    && req.files.AadharDocument.length
                                    && req.files.AadharDocument[0]) {
                                    move('./public/uploads/candidate/' + req.files.AadharDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.AadharDocument[0].filename);
                                }

                                if (req.files.PANDocument
                                    && req.files.PANDocument.length
                                    && req.files.PANDocument[0]) {
                                    move('./public/uploads/candidate/' + req.files.PANDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.PANDocument[0].filename);
                                }

                                if (req.files.AssessmentDocument
                                    && req.files.AssessmentDocument.length
                                    && req.files.AssessmentDocument[0]) {
                                    move('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.AssessmentDocument[0].filename);
                                }

                                if (req.files.IDProofDocument
                                    && req.files.IDProofDocument.length
                                    && req.files.IDProofDocument[0]) {
                                    move('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.IDProofDocument[0].filename);
                                }

                                if (req.files.PassbookDocument
                                    && req.files.PassbookDocument.length
                                    && req.files.PassbookDocument[0]) {
                                    move('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.PassbookDocument[0].filename);
                                }

                                if (req.files.QualificationDocument
                                    && req.files.QualificationDocument.length
                                    && req.files.QualificationDocument[0]) {
                                    move('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.QualificationDocument[0].filename);
                                }

                                await WorkOrderModel.updateOne({ _id: value.WorkOrder }, { $set: _WorkOrderData });

                                await WorkOrderRoleModel.updateOne({ _id: value.WorkOrderRole }, { $set: _WorkOrderRoleData });

                                var userData = await UserModel.findOne({ userName: user.userName })
                                await UserModel.updateOne({ _id: userData._id }, { $set: { approved: userData.approved + 1 } })

                                return res
                                    .status(200)
                                    .send({ success: true, message: 'Employee details saved successfully', data: result });
                            })

                    })

                })
            }
        } catch (error) {
            if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
            if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
            if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
            if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
            if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
            if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
            if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
            if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
            console.log("error - controller ", error);
            return res
                .status(500)
                .send({ success: false, message: 'Internal server error' });
        }
    }
}

exports.deleteEmployee = async function (req, res) {
    const { error, value } = EmployeeValidations
        .validate(EmployeeValidations.ValidationTypes.EMPLOYEE_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await EmployeeModel
            .updateOne({ _id: value.id }, { $set: { isDeleted: true } })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                var path = "./public/uploads/candidate/" + value.id
                if (fs.existsSync(path)) {
                    fs.readdirSync(path).forEach(function (file) {
                        var curPath = path + "/" + file;
                        if (fs.lstatSync(curPath).isDirectory()) { // recurse
                            deleteFolderRecursive(curPath);
                        } else { // delete file
                            fs.unlinkSync(curPath);
                        }
                    });
                    fs.rmdirSync(path);
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Employee deleted successfully' })
            })
    }
}

function move(oldPath, newPath) {
    var source = fs.createReadStream(oldPath);
    var dest = fs.createWriteStream(newPath);

    source.pipe(dest);
    source.on('end', function () { /* copied */
        console.log('Successfully renamed - AKA moved!');
        fs.unlinkSync(oldPath);
    });
    source.on('error', function (err) { /* error */
        console.log("copy err", err);
    });
}


exports.addBulkEmployee = async function (req, res) {
    try {
        req.body.forEach(async sdata => {

            const FamilyDetailIds = await FamilyDetailModel({
                Relationship: await RelationshipModel.findOne({ name: sdata.FamRelationship }),
                Name: sdata.FamName,
                DateOfBirth: sdata.FamDateOfBirth,
                Age: sdata.FamAge,
                ContactNo: sdata.FamContactNo,
                AadharNo: sdata.FamAadharNo
            })
            FamilyDetailIds.save();

            const EducationalQualificationIds = await EducationalQualificationModel({
                Course: await CourseModel.findOne({ name: sdata.EduCourse }),
                SchoolCollegeName: sdata.EduSchoolCollegeName,
                From: sdata.EduFrom,
                To: sdata.EduTo,
                Marks: sdata.EduMarks,
            })
            EducationalQualificationIds.save();

            const WorkExperienceIds = await WorkExperienceModel({
                // Designation: await DesignationModel.findOne({ name: sdata.ExpDesignation }),
                Designation: sdata.ExpDesignation,
                CompanyName: sdata.ExpCompanyName,
                From: sdata.ExpFrom,
                To: sdata.ExpTo,
                ExperienceYear: sdata.ExpExperienceYear,
                SalaryDrawn: sdata.ExpSalaryDrawn,
                ReasonForLeaving: sdata.ExpReasonForLeaving,
                SupervisorName: sdata.ExpSupervisorName,
                SupervisorMobile: sdata.ExpSupervisorMobile,
                SupervisorEmail: sdata.ExpSupervisorEmail,
            })
            WorkExperienceIds.save();

            const LanguagesKnownIds = await LanguagesKnownModel({
                Language: await LanguageModel.findOne({ name: sdata.LngLanguage }),
                Speak: sdata.LngSpeak,
                Read: sdata.LngRead,
                Write: sdata.LngWrite,
            })
            LanguagesKnownIds.save();

            const ReferencesIds = await ReferencesModel({
                Name: sdata.RefName,
                Occupation: sdata.RefOccupation,
                Address: sdata.RefAddress,
                ContactNo: sdata.RefContactNo,
                AadharNo: sdata.RefAadharNo
            })
            ReferencesIds.save();

            var EmployeeData = new EmployeeModel({
                FullName: sdata.EmpFullName,
                ParentName: sdata.EmpParentName,
                DateOfBirth: sdata.EmpDateOfBirth,
                PlaceOfBirth: sdata.EmpPlaceOfBirth,
                Age: sdata.EmpAge,
                Gender: await GenderModel.findOne({ name: sdata.EmpGender }),
                MaritalStatus: await MaritalStatusModel.findOne({ name: sdata.EmpMaritalStatus }),
                Religion: await ReligionModel.findOne({ name: sdata.EmpReligion }),
                MotherTongue: sdata.EmpMotherTongue,
                BloodGroup: await BloodGroupModel.findOne({ name: sdata.EmpBloodGroup }),
                PresentAddress: sdata.EmpPresentAddress,
                PresentAddressPincode: sdata.EmpPresentAddressPincode,
                PresentAddressPhone: sdata.EmpPresentAddressPhone,
                PermanentAddress: sdata.EmpPermanentAddress,
                PermanentAddressPincode: sdata.EmpPermanentAddressPincode,
                PermanentAddressPhone: sdata.EmpPermanentAddressPhone,
                Identification1: sdata.EmpIdentification1,
                Identification2: sdata.EmpIdentification2,
                Mark1: sdata.EmpMark1,
                Mark2: sdata.EmpMark2,
                AadharNo: sdata.EmpAadharNo,
                PAN: sdata.EmpPAN,
                WorkExperienceType: sdata.ExpType,

                UniversalAccount: sdata.UANUniversalAccount,
                PFAccount: sdata.UANPFAccount,
                ESI: sdata.UANESI,
                SchemeCertificate: sdata.UANSchemeCertificate,
                PPONumber: sdata.UANPPONumber,
                NonContributoryPeriod: sdata.UANNonContributoryPeriod,

                LanguagesKnown: LanguagesKnownIds,
                FamilyDetail: FamilyDetailIds,
                EducationalQualification: EducationalQualificationIds,
                WorkExperience: WorkExperienceIds,
                References: ReferencesIds,
            })

            EmployeeData.save((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' });
                }
            })

            // await EmployeeModel.updateOne({ $set: EmployeeData })
            // const EmployeeModelData = await EmployeeModel
            //     .populate('FamilyDetail')
            //     .populate('EducationalQualification')
            //     .populate('WorkExperience')
            //     .populate('LanguagesKnown')
            //     .populate('References')

        });

        return res
            .status(200)
            .send({ success: true, message: 'Employee details updated Successfully', data: "Successfull" })
    }
    catch (err) {
        console.log("error - controller ", error);
        return res
            .status(500)
            .send({ success: false, message: 'Internal server error' });
    }
}



exports.addEmployee = async function (req, res) {
    const { error, value } = EmployeeValidations
        .validate(EmployeeValidations.ValidationTypes.PUBLIC_EMPLOYEE_REGISTER, req.body);

    if (error) {
        if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
        if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
        if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
        if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
        if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
        if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
        if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
        if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else if (!req.files.CandidatePhoto) {
        if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
        if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
        if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
        if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
        if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
        if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
        if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: 'CandidatePhoto is required' });
    }
    else if (!req.files.AadharDocument) {
        if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
        if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
        if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
        if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
        if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
        if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
        if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: 'AadharDocument is required' });
    }
    else if (!req.files.PassbookDocument) {
        if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
        if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
        if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
        if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
        if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
        if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
        if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: 'PassbookDocument is required' });
    }
    else {

        try {

            if (req.body.FamilyDetail) {
                const { success, message } = await EmployeeValidations.validateFamilyDetail(req.body.FamilyDetail);
                if (!success) {
                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: message });
                }
            }

            if (req.body.EducationalQualification) {
                const { success, message } = await EmployeeValidations.validateEducationalQualification(req.body.EducationalQualification);
                if (!success) {
                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: message });
                }
            }

            if (req.body.WorkExperience && req.body.WorkExperienceType == "EXPERIENCED") {
                const { success, message } = await EmployeeValidations.validateWorkExperience(req.body.WorkExperience);
                if (!success) {
                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: message });
                }
            }

            if (req.body.LanguagesKnown) {
                const { success, message } = await EmployeeValidations.validateLanguagesKnown(req.body.LanguagesKnown);
                if (!success) {
                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: message });
                }
            }

            if (req.body.References && req.body.WorkExperienceType == "EXPERIENCED") {
                const { success, message } = await EmployeeValidations.validateReferences(req.body.References);
                if (!success) {
                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                    return res
                        .status(400)
                        .send({ success: false, message: message });
                }
            }

            var FamilyDetailIds = [];
            if (req.body.FamilyDetail) {
                req.body.FamilyDetail = JSON.parse(req.body.FamilyDetail);
                if (Array.isArray(req.body.FamilyDetail) && req.body.FamilyDetail.length > 0) {
                    for (const Member of req.body.FamilyDetail) {
                        const MemberData = {
                            Relationship: Member.Relationship,
                            Name: Member.Name,
                            DateOfBirth: Member.DateOfBirth,
                            Age: Member.Age,
                            ContactNo: Member.ContactNo,
                            AadharNo: Member.AadharNo
                        }
                        if (Member.id) {
                            FamilyDetailIds.push(Member.id)
                            await FamilyDetailModel.updateOne({ _id: Member.id }, { $set: MemberData })
                        } else {
                            const FamilyDetailData = new FamilyDetailModel(MemberData);
                            const result = await FamilyDetailData.save();
                            if (result && result._id) {
                                FamilyDetailIds.push(result._id)
                            }
                        }
                    }
                }
            }

            var EducationalQualificationIds = [];
            if (req.body.EducationalQualification) {
                req.body.EducationalQualification = JSON.parse(req.body.EducationalQualification);
                if (Array.isArray(req.body.EducationalQualification) && req.body.EducationalQualification.length > 0) {
                    for (const EducationalQualification of req.body.EducationalQualification) {
                        const EducationalQualificationData = {
                            Course: EducationalQualification.Course,
                            SchoolCollegeName: EducationalQualification.SchoolCollegeName,
                            From: EducationalQualification.From,
                            To: EducationalQualification.To,
                            Marks: EducationalQualification.Marks,
                        }
                        if (EducationalQualification.id) {
                            EducationalQualificationIds.push(EducationalQualification.id)
                            await EducationalQualificationModel.updateOne({ _id: EducationalQualification.id }, { $set: EducationalQualificationData })
                        } else {
                            const _EducationalQualificationData = new EducationalQualificationModel(EducationalQualificationData);
                            const result = await _EducationalQualificationData.save();
                            if (result && result._id) {
                                EducationalQualificationIds.push(result._id)
                            }
                        }
                    }
                }
            }

            var WorkExperienceIds = [];
            if (req.body.WorkExperienceType == "EXPERIENCED" && req.body.WorkExperience) {
                req.body.WorkExperience = JSON.parse(req.body.WorkExperience);
                if (Array.isArray(req.body.WorkExperience) && req.body.WorkExperience.length > 0) {
                    for (const WorkExperience of req.body.WorkExperience) {
                        const WorkExperienceData = {
                            Designation: WorkExperience.Designation,
                            CompanyName: WorkExperience.CompanyName,
                            From: WorkExperience.From,
                            To: WorkExperience.To,
                            ExperienceYear: WorkExperience.ExperienceYear,
                            SalaryDrawn: WorkExperience.SalaryDrawn,
                            ReasonForLeaving: WorkExperience.ReasonForLeaving,
                            SupervisorName: WorkExperience.SupervisorName,
                            SupervisorMobile: WorkExperience.SupervisorMobile,
                            SupervisorEmail: WorkExperience.SupervisorEmail,
                        }
                        if (WorkExperience.id) {
                            WorkExperienceIds.push(WorkExperience.id)
                            await WorkExperienceModel.updateOne({ _id: WorkExperience.id }, { $set: WorkExperienceData })
                        } else {
                            const _WorkExperienceData = new WorkExperienceModel(WorkExperienceData);
                            const result = await _WorkExperienceData.save();
                            if (result && result._id) {
                                WorkExperienceIds.push(result._id)
                            }
                        }
                    }
                }
            }

            var LanguagesKnownIds = [];
            if (req.body.LanguagesKnown) {
                req.body.LanguagesKnown = JSON.parse(req.body.LanguagesKnown);
                if (Array.isArray(req.body.LanguagesKnown) && req.body.LanguagesKnown.length > 0) {
                    for (const LanguagesKnown of req.body.LanguagesKnown) {
                        const LanguagesKnownData = {
                            Language: LanguagesKnown.Language,
                            Speak: LanguagesKnown.Speak,
                            Read: LanguagesKnown.Read,
                            Write: LanguagesKnown.Write,
                        }
                        if (LanguagesKnown.id) {
                            LanguagesKnownIds.push(LanguagesKnown.id)
                            await LanguagesKnownModel.updateOne({ _id: LanguagesKnown.id }, { $set: LanguagesKnownData })
                        } else {
                            const _LanguagesKnownData = new LanguagesKnownModel(LanguagesKnownData);
                            const result = await _LanguagesKnownData.save();
                            if (result && result._id) {
                                LanguagesKnownIds.push(result._id)
                            }
                        }
                    }
                }
            }

            var ReferencesIds = [];
            if (req.body.WorkExperienceType == "EXPERIENCED" && req.body.References) {
                req.body.References = JSON.parse(req.body.References);
                if (Array.isArray(req.body.References) && req.body.References.length > 0) {
                    for (const References of req.body.References) {
                        const ReferencesData = {
                            Name: References.Name,
                            Occupation: References.Occupation,
                            Address: References.Address,
                            ContactNo: References.ContactNo,
                            AadharNo: References.AadharNo
                        }
                        if (References.id) {
                            ReferencesIds.push(References.id)
                            await ReferencesModel.updateOne({ _id: References.id }, { $set: ReferencesData })
                        } else {
                            const _ReferencesData = new ReferencesModel(ReferencesData);
                            const result = await _ReferencesData.save();
                            if (result && result._id) {
                                ReferencesIds.push(result._id)
                            }
                        }
                    }
                }
            }

            let isESIandPF = true;
            if ((value.UniversalAccount && value.PFAccount && value.ESI && value.SchemeCertificate && value.PPONumber && value.NonContributoryPeriod)) {
                isESIandPF = true;
            }
            else {
                isESIandPF = false;
            }

            let isBankData = true;
            if ((value.BankName && value.Branch && value.AccountNumber && value.IFSC)) {
                isBankData = true;
            }
            else {
                isBankData = false;
            }

            var EmployeeData = {
                FullName: value.FullName,
                ParentName: value.ParentName,
                EmailId: value.EmailId,
                SpouseName: value.SpouseName,
                DateOfBirth: value.DateOfBirth,
                PlaceOfBirth: value.PlaceOfBirth,
                Age: value.Age,
                Gender: value.Gender,
                MaritalStatus: value.MaritalStatus,
                Religion: value.Religion,
                MotherTongue: value.MotherTongue,
                BloodGroup: value.BloodGroup,
                PresentAddress: value.PresentAddress,
                PresentAddressPincode: value.PresentAddressPincode,
                PresentAddressPhone: value.PresentAddressPhone,
                PermanentAddress: value.PermanentAddress,
                PermanentAddressPincode: value.PermanentAddressPincode,
                PermanentAddressPhone: value.PermanentAddressPhone,
                Identification1: value.Identification1,
                Identification2: value.Identification2,
                Mark1: value.Mark1,
                Mark2: value.Mark2,
                AadharNo: value.AadharNo,
                PAN: value.PAN,
                FamilyDetail: FamilyDetailIds,
                EducationalQualification: EducationalQualificationIds,
                WorkExperience: WorkExperienceIds,
                LanguagesKnown: LanguagesKnownIds,
                References: ReferencesIds,
                WorkExperienceType: value.WorkExperienceType,
                ESIBasedOn: value.ESIBasedOn,

                IsESIPFAdded: isESIandPF,
                UniversalAccount: value.UniversalAccount,
                PFAccount: value.PFAccount,
                ESI: value.ESI,
                SchemeCertificate: value.SchemeCertificate,
                PPONumber: value.PPONumber,
                NonContributoryPeriod: value.NonContributoryPeriod,

                IsBankDetailAdded: isBankData,
                BankName: value.BankName,
                Branch: value.Branch,
                AccountNumber: value.AccountNumber,
                IFSC: value.IFSC,

                CandidatePhoto: 'uploads/candidate/' + value.id + "/" + req.files.CandidatePhoto[0].filename,
                ResumeDocument: req.files.ResumeDocument ? 'uploads/candidate/' + value.id + "/" + req.files.ResumeDocument[0].filename : '',
                AadharDocument: 'uploads/candidate/' + value.id + "/" + req.files.AadharDocument[0].filename,
                PANDocument: req.files.PANDocument ? 'uploads/candidate/' + value.id + "/" + req.files.PANDocument[0].filename : '',
                AssessmentDocument: req.files.AssessmentDocument ? 'uploads/candidate/' + value.id + "/" + req.files.AssessmentDocument[0].filename : '',
                IDProofDocument: req.files.IDProofDocument ? 'uploads/candidate/' + value.id + "/" + req.files.IDProofDocument[0].filename : '',
                PassbookDocument: 'uploads/candidate/' + value.id + "/" + req.files.PassbookDocument[0].filename,
                QualificationDocument: req.files.QualificationDocument ? 'uploads/candidate/' + value.id + "/" + req.files.QualificationDocument[0].filename : ''
            }

            EmployeeData['RegisterDate'] = new Date();
            var EmployeeModelData = new EmployeeModel(EmployeeData);
            EmployeeModelData.save(async (err, result) => {

                if ((+(result.EmployeeId)) < 10) {
                    var empid = "0000" + result.EmployeeId;
                    await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                }
                else if ((+(result.EmployeeId)) < 100) {
                    var empid = "000" + result.EmployeeId;
                    await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                }
                else if ((+(result.EmployeeId)) < 1000) {
                    var empid = "00" + result.EmployeeId;
                    await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                }
                else if ((+(result.EmployeeId)) < 10000) {
                    var empid = "0" + result.EmployeeId;
                    await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                }
                else if ((+(result.EmployeeId)) < 100000) {
                    var empid = result.EmployeeId;
                    await EmployeeModel.updateOne({ _id: result }, { $set: { UniqueEmpId: `SISIPL${empid}` } })
                }

                if (err) {
                    if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                    if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                    if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                    if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                    if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                    if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                    if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' });
                }

                if (!fs.existsSync('./public/uploads/candidate/' + EmployeeModelData._id)) {
                    fs.mkdirSync('./public/uploads/candidate/' + EmployeeModelData._id, { recursive: true });
                }

                if (req.files.CandidatePhoto
                    && req.files.CandidatePhoto.length
                    && req.files.CandidatePhoto[0]) {
                    EmployeeModelData['CandidatePhoto'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.CandidatePhoto[0].filename;
                }

                if (req.files.ResumeDocument
                    && req.files.ResumeDocument.length
                    && req.files.ResumeDocument[0]) {
                    EmployeeModelData['ResumeDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.ResumeDocument[0].filename;
                }

                if (req.files.AadharDocument
                    && req.files.AadharDocument.length
                    && req.files.AadharDocument[0]) {
                    EmployeeModelData['AadharDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.AadharDocument[0].filename;
                }

                if (req.files.PANDocument
                    && req.files.PANDocument.length
                    && req.files.PANDocument[0]) {
                    EmployeeModelData['PANDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.PANDocument[0].filename;
                }

                if (req.files.AssessmentDocument
                    && req.files.AssessmentDocument.length
                    && req.files.AssessmentDocument[0]) {
                    EmployeeModelData['AssessmentDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.AssessmentDocument[0].filename;
                }

                if (req.files.IDProofDocument
                    && req.files.IDProofDocument.length
                    && req.files.IDProofDocument[0]) {
                    EmployeeModelData['IDProofDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.IDProofDocument[0].filename;
                }

                if (req.files.PassbookDocument
                    && req.files.PassbookDocument.length
                    && req.files.PassbookDocument[0]) {
                    EmployeeModelData['PassbookDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.PassbookDocument[0].filename;
                }

                if (req.files.QualificationDocument
                    && req.files.QualificationDocument.length
                    && req.files.QualificationDocument[0]) {
                    EmployeeModelData['QualificationDocument'] = 'uploads/candidate/' + EmployeeModelData._id + "/" + req.files.QualificationDocument[0].filename;
                }

                EmployeeModelData.ViewStatus = [
                    {
                        Title: "Public",
                        Name: "Public",
                        Date: new Date()
                    }
                ]

                EmployeeModelData.InterviewDetail = [
                    {
                        Name: 'Details filled by Public',
                        UpdatedOn: new Date(),
                        Status: "Under Revaluation by Field Officer"
                    }
                ]

                await EmployeeModel
                    .updateOne({ _id: EmployeeModelData._id }, { $set: EmployeeModelData })
                    .exec(async (err, result1) => {
                        if (err) {
                            if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
                            if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
                            if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
                            if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
                            if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
                            if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
                            if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
                            if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
                            return res
                                .status(500)
                                .send({ success: false, message: 'Internal server error' })
                        }

                        if (req.files.CandidatePhoto
                            && req.files.CandidatePhoto.length
                            && req.files.CandidatePhoto[0]) {
                            move('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.CandidatePhoto[0].filename);
                        }

                        if (req.files.ResumeDocument
                            && req.files.ResumeDocument.length
                            && req.files.ResumeDocument[0]) {
                            move('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.ResumeDocument[0].filename);
                        }

                        if (req.files.AadharDocument
                            && req.files.AadharDocument.length
                            && req.files.AadharDocument[0]) {
                            move('./public/uploads/candidate/' + req.files.AadharDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.AadharDocument[0].filename);
                        }

                        if (req.files.PANDocument
                            && req.files.PANDocument.length
                            && req.files.PANDocument[0]) {
                            move('./public/uploads/candidate/' + req.files.PANDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.PANDocument[0].filename);
                        }

                        if (req.files.AssessmentDocument
                            && req.files.AssessmentDocument.length
                            && req.files.AssessmentDocument[0]) {
                            move('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.AssessmentDocument[0].filename);
                        }

                        if (req.files.IDProofDocument
                            && req.files.IDProofDocument.length
                            && req.files.IDProofDocument[0]) {
                            move('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.IDProofDocument[0].filename);
                        }

                        if (req.files.PassbookDocument
                            && req.files.PassbookDocument.length
                            && req.files.PassbookDocument[0]) {
                            move('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.PassbookDocument[0].filename);
                        }

                        if (req.files.QualificationDocument
                            && req.files.QualificationDocument.length
                            && req.files.QualificationDocument[0]) {
                            move('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename, './public/uploads/candidate/' + EmployeeModelData._id + "/" + req.files.QualificationDocument[0].filename);
                        }

                        return res
                            .status(200)
                            .send({ success: true, message: 'Employee details saved successfully', data: result });
                    })

            })
        } catch (error) {
            if (req.files.CandidatePhoto) { fs.unlinkSync('./public/uploads/candidate/' + req.files.CandidatePhoto[0].filename) }
            if (req.files.ResumeDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.ResumeDocument[0].filename) }
            if (req.files.AadharDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AadharDocument[0].filename) }
            if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PANDocument[0].filename) }
            if (req.files.AssessmentDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.AssessmentDocument[0].filename) }
            if (req.files.IDProofDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.IDProofDocument[0].filename) }
            if (req.files.PassbookDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.PassbookDocument[0].filename) }
            if (req.files.QualificationDocument) { fs.unlinkSync('./public/uploads/candidate/' + req.files.QualificationDocument[0].filename) }
            console.log("error - controller ", error);
            return res
                .status(500)
                .send({ success: false, message: 'Internal server error' });
        }
    }
}


