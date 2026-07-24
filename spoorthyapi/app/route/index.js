const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var multer = require('multer');
var fs = require('fs');
const cron = require('node-cron');
const Enum = require('../constants/enum')
const UserModel = require('../model/user')
var billController = require('../controller/billController')

// const allowedPaths = ['/getGender', '/getCourse', '/getDesignation', '/getOccupation', '/getMaritalStatus', '/getReligion',
//     '/getBloodGroup', '/getLanguage', '/getRelationship',];

const excelUpload = require('../middleware/excelUpload');

if (!fs.existsSync('./public/uploads/candidate')) {
    fs.mkdirSync('./public/uploads/candidate', { recursive: true });
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/candidate');
    },
    filename: function (req, file, cb) {
        console.log("file", file);
        cb(null, file.fieldname + "_" + Date.now() + "-" + file.originalname);
    }
})


if (!fs.existsSync('./public/uploads/clients')) {
    fs.mkdirSync('./public/uploads/clients', { recursive: true });
}

var storageClient = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/clients');
    },
    filename: function (req, file, cb) {
        console.log("file", file);
        cb(null, file.fieldname + "_" + Date.now() + "-" + file.originalname);
    }
})

if (!fs.existsSync('./public/uploads/users')) {
    fs.mkdirSync('./public/uploads/users', { recursive: true });
}

var storageUser = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/users');
    },
    filename: function (req, file, cb) {
        console.log("file", file);
        cb(null, file.fieldname + "_" + Date.now() + "-" + file.originalname);
    }
})

const uploadEmployeeDetails = multer({ storage: storage });
var cpEmployeeDetails = uploadEmployeeDetails.fields([
    { name: 'CandidatePhoto' },
    { name: 'AadharDocument' },
    { name: 'ResumeDocument' },
    { name: 'IDProofDocument' },
    { name: 'PassbookDocument' },
    { name: 'PANDocument' },
    { name: 'AssessmentDocument' },
    { name: 'QualificationDocument' }
]);
var cpFeedbackDetails = uploadEmployeeDetails.fields([
    { name: 'FeedbackPhoto' },
]);

cron.schedule('*/30 * * * *', () => {
    console.log("cron run, Daily update and generate certificate at ", new Date().toLocaleString());
    billController.generatePaySlipForBill()
});

router.get('/generatePaySlipForBills', billController.generatePaySlipForBill);

var employeeController = require('../controller/employeeController');
router.post('/addEmployee', cpEmployeeDetails, employeeController.addEmployee);

const authController = require('../controller/authController');
router.get('/GetSMSLink/:mobileNo', authController.GetSMSLink);

router.post('/sendOtp', authController.sendOtp);
router.post('/verifyOtp', authController.verifyOtp);
router.post('/refreshTokenMobile', authController.refreshTokenMobile);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/login', authController.login);
router.post('/refreshTokenWeb', authController.refreshTokenWeb);

var genderController = require('../controller/genderController');
router.get('/getGender', genderController.getGender);
router.post('/addGender', genderController.addGender);

var maritalStatusController = require('../controller/maritalStatusController');
router.get('/getMaritalStatus', maritalStatusController.getMaritalStatus);

var courseController = require('../controller/courseController');
router.get('/getCourse', courseController.getCourse);

var designationController = require('../controller/designationController');
router.get('/getDesignation', designationController.getDesignation);

var occupationController = require('../controller/occupationController');
router.get('/getOccupation', occupationController.getOccupation);

var religionController = require('../controller/religionController');
router.get('/getReligion', religionController.getReligion);

var bloodGroupController = require('../controller/bloodGroupController');
router.get('/getBloodGroup', bloodGroupController.getBloodGroup);

const languageController = require('../controller/languageController');
router.get('/getLanguage', languageController.getLanguage);

const relationshipController = require('../controller/relationshipController');
router.get('/getRelationship', relationshipController.getRelationship);

const roleController = require('../controller/roleController');
router.get('/getRole', roleController.getRole);
router.post('/addRole', roleController.addRole);

router.get('/getEmployee', employeeController.getEmployee);

const uploadUserDetails = multer({ storage: storageUser });
var cpUserDetails = uploadUserDetails.fields([
    { name: 'photo' },
]);

const userController = require('../controller/userController');
router.get('/getUser', userController.getUser);
router.post('/getUserById', userController.getUserById);
// router.post('/addUser', cpUserDetails, userController.addUser);
router.post('/addUser', userController.addUser);
router.post('/editUser', userController.editUser);
router.post('/deleteUser', userController.deleteUser);
router.post('/setStatus', userController.setStatus);
router.post('/setLocation', userController.setLocation);

router.use(function (req, res, next) {
    var token = req.body.authorization || req.query.authorization || req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (err) {
                return res
                    .status(401)
                    .send({ success: false, message: 'Failed to authenticate token. 5' });
            } else {

                UserModel
                    .findOne({ userName: decoded.user.userName })
                    .exec(async (err, result) => {

                        var Now = new Date()
                        if (Now.getTime() >= result.endOfDay.getTime()) {
                            result.endOfDay = new Date().setHours(23, 59, 59, 999)
                            result.approved = 0

                            await UserModel.updateOne({ userName: result.userName }, { $set: result })
                        }
                    })

                const allowedRoles = [
                    Enum.ADMIN_ROLE.FIELD_OFFICER,
                    Enum.ADMIN_ROLE.GENERAL_MANAGER,
                    Enum.ADMIN_ROLE.MANAGING_DIRECTOR,
                    Enum.ADMIN_ROLE.HR,
                    Enum.ADMIN_ROLE.SR_HR,
                    Enum.ADMIN_ROLE.ACCOUNT_TEAM,
                    Enum.ADMIN_ROLE.ADMIN,
                ];

                if (allowedRoles.includes(decoded.user.role)) {
                    req.decoded = decoded;
                    next();
                } else {
                    return res
                        .status(401)
                        .send({ success: false, message: 'Failed to authenticate token. 5' });
                }
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

var approvalStepsController = require('../controller/approvalStepsController')
router.post('/GMApproval', approvalStepsController.GMApproval);
router.post('/MDApproval', approvalStepsController.MDApproval);
router.get('/getGMApprovalList', approvalStepsController.getGMApprovalList);
router.get('/getMDApprovalList', approvalStepsController.getMDApprovalList);
router.post('/GMApprovalList', approvalStepsController.GMApprovalList);
router.post('/MDApprovalList', approvalStepsController.MDApprovalList);

var dashboardController = require('../controller/dashboardController');
router.get('/getMainDashboard', dashboardController.getMainDashboard);
router.get('/getAllClientDashboard', dashboardController.getAllClientDashboard);
router.post('/getClientDashboardById', dashboardController.getClientDashboardById);
router.get('/getCandidateDashboard', dashboardController.getCandidateDashboard);
router.post('/getWorkOrderDashboardById', dashboardController.getWorkOrderDashboardById);
router.get('/getAllJobRoleDashboard', dashboardController.getAllJobRoleDashboard);

router.get('/getBill', billController.getBill);
router.post('/getBillByWorkOrder', billController.getBillByWorkOrder);
router.post('/getBillByWorkOrderAllData', billController.getBillByWorkOrderAllData);
router.post('/getBillByMonthandClient', billController.getBillByMonthandClient);
router.post('/getBillByDate', billController.getBillByDate);
router.get('/getBillNotGenerated', billController.getBillNotGenerated);
router.post('/getPostBillNotGenerated', billController.getPostBillNotGenerated);
router.get('/getBillNotPaid', billController.getBillNotPaid);
router.post('/getPostBillNotPaid', billController.getPostBillNotPaid);
router.post('/saveEditBill', billController.saveEditBill);
router.post('/saveEditBillAbstract', billController.saveEditBillAbstract);
router.post('/generateBill', billController.generateBill);
router.post('/getBillById', billController.getBillById);
router.post('/addPaymentToBill', billController.addPaymentToBill);
// router.post('/getBillInvoice', billController.getBillInvoice);

var PaySlipController = require('../controller/PaySlipController')
router.post('/getPaySlipWithFilter', PaySlipController.getPaySlipWithFilter);
router.post('/getSalaryStatement', PaySlipController.getSalaryStatement);
// router.get('/getPaySlipById', PaySlipController.getPaySlipById);

var attendanceController = require('../controller/attendanceController')
router.post('/getAttendanceByDate', attendanceController.getAttendanceByDate);

router.post('/getPostEmployee', employeeController.getPostEmployee);
router.post('/getPostEmployeeFilter', employeeController.getPostEmployeeFilter);
router.post('/getEmployeeByWorkOrder', employeeController.getEmployeeByWorkOrder);
router.post('/getEmployeeById', employeeController.getEmployeeById);
router.get('/getHiredEmployee', employeeController.getHiredEmployee);
router.get('/getRejectedEmployee', employeeController.getRejectedEmployee);
router.post('/addEditEmployee', cpEmployeeDetails, employeeController.addEditEmployee);
router.post('/deleteEmployee', cpEmployeeDetails, employeeController.deleteEmployee);
router.post('/addBankDetails', employeeController.addBankDetails);
router.post('/addESIPFDetails', employeeController.addESIPFDetails);
router.post('/addFeedback', cpFeedbackDetails, employeeController.addFeedback);
router.post('/addBulkEmployee', employeeController.addBulkEmployee);
router.post('/getAllCientwiseHiredEmp', employeeController.getAllCientwiseHiredEmp);

const uploadClientDetails = multer({ storage: storageClient });
var cpClientDetails = uploadClientDetails.fields([
    { name: 'companyLogo' },
    { name: 'agreementDocument' },
    { name: 'licenseDocument' },
    { name: 'GSTDocument' },
    { name: 'PANDocument' },
    { name: 'TANDocument' },
    { name: 'workOrderDocument' },
    { name: 'bankGuaranteeDocument' },
]);

var clientController = require('../controller/clientController');
router.get('/getClient', clientController.getClient);
router.post('/getPostClient', clientController.getPostClient);
router.post('/getClientById', clientController.getClientById);
router.post('/addEditClient', cpClientDetails, clientController.addEditClient);
router.post('/deleteClient/:id', cpClientDetails, clientController.deleteClient);

var workOrderController = require('../controller/workOrderController');
router.get('/getWorkOrder', workOrderController.getWorkOrder);
router.post('/getWorkOrderById', workOrderController.getWorkOrderById);
router.post('/getWorkOrderByClient', workOrderController.getWorkOrderByClient);
router.post('/getSubWorkOrderByClient', workOrderController.getSubWorkOrderByClient);
router.get('/getWorkOrderNotHired', workOrderController.getWorkOrderNotHired);
router.post('/getPostWorkOrderNotHired', workOrderController.getPostWorkOrderNotHired);
router.post('/addEditWorkOrder', cpClientDetails, workOrderController.addEditWorkOrder);
router.post('/deleteWorkOrder', workOrderController.deleteWorkOrder);

router.post('/addCourse', courseController.addCourse);
router.post('/deleteCourse', courseController.deleteCourse);
router.post('/editCourse', courseController.editCourse);

router.post('/addDesignation', designationController.addDesignation);
router.post('/deleteDesignation', designationController.deleteDesignation);
router.post('/editDesignation', designationController.editDesignation);
router.post('/designation/bulkUpload', excelUpload.single('file'), designationController.bulkUploadDesignation);

var salaryStructureController = require('../controller/salaryStructureController');
router.get('/getStructure', salaryStructureController.getSalaryStructure);
router.post('/addStructure', salaryStructureController.addSalaryStructure);
router.post('/deleteStructure', salaryStructureController.deleteSalaryStructure);
router.post('/editStructure', salaryStructureController.editSalaryStructure);

router.post('/addOccupation', occupationController.addOccupation);

router.post('/addMaritalStatus', maritalStatusController.addMaritalStatus);

router.post('/addReligion', religionController.addReligion);
router.post('/deleteReligion', religionController.deleteReligion);
router.post('/editReligion', religionController.editReligion);

router.post('/addBloodGroup', bloodGroupController.addBloodGroup);

router.post('/addLanguage', languageController.addLanguage);
router.post('/deleteLanguage', languageController.deleteLanguage);
router.post('/editLanguage', languageController.editLanguage);

router.post('/addRelationship', relationshipController.addRelationship);
router.post('/deleteRelationship', relationshipController.deleteRelationship);
router.post('/editRelationship', relationshipController.editRelationship);

const yearController = require('../controller/yearController');
router.get('/getYear', yearController.getYear);
router.post('/addYear', yearController.addYear);
router.post('/deleteYear', yearController.deleteYear);
router.post('/editYear', yearController.editYear);

const paymentModeController = require('../controller/paymentModeController');
router.get('/getPaymentMode', paymentModeController.getPaymentMode);
router.post('/addPaymentMode', paymentModeController.addPaymentMode);

const employeeLogsController = require('../controller/employeeLogsController');
router.get('/getEmployeeLogs', employeeLogsController.getEmployeeLogs);

const payscaleFixationController = require('../controller/payscaleFixationController');
router.get('/getPayscaleFixation', payscaleFixationController.getPayscaleFixation);
router.post('/addPayscaleFixation', payscaleFixationController.addPayscaleFixation);
router.post('/editPayscaleFixation', payscaleFixationController.editPayscaleFixation);
router.post('/deletePayscaleFixation', payscaleFixationController.deletePayscaleFixation);

const reportController = require('../controller/reportController');
router.get('/getAllWorkOrderRoles', reportController.getAllWorkOrderRoles);
router.get('/getAllDesignationwise', reportController.getAllDesignationwise);
router.get('/getAllWorkOrder', reportController.getAllWorkOrder);
router.get('/getAllClient', reportController.getAllClient);

router.post('/getEmpReportByUnitBranch', reportController.getEmpReportByUnitBranch);
router.post('/getEmpReportByDesignation', reportController.getEmpReportByDesignation);
router.post('/getEmpReportByWorkOrder', reportController.getEmpReportByWorkOrder);
router.post('/getEmpReportByClient', reportController.getEmpReportByClient);


router.post('/sendSMS', authController.sendSMS);

module.exports = router;