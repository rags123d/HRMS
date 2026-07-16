const PaySlipValidations = require('../validations/paySlipValidations');
const AttendanceModel = require('../model/attendance');
const GeneralUtils = require('../utils/generalUtils');
const EmployeeModel = require('../model/employee');
const BillModel = require('../model/bill');
const BillValidations = require('../validations/billValidations');


exports.getPaySlipWithFilter = async function (req, res) {
    const { error, value } = PaySlipValidations
        .validate(PaySlipValidations.ValidationTypes.PAYSLIP_FILTER_SCHEMA, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        try {
            EmployeeModel
                .findOne({ UniqueEmpId: value.EmpID })
                .populate({
                    path: "WorkOrder",
                    populate: {
                        path: "client",
                        populate: {
                            path: "designation"
                        }
                    }
                }).populate({
                    path: "WorkOrderRole"
                })

                .exec((err, empData) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ success: false, message: 'Internal server error' });
                    }
                    AttendanceModel
                        .findOne({
                            Employee: empData._id,
                            Month: value.SelectedMonth,
                            Year: (+value.SelectedYear)
                        })
                        .exec((aterr, atndcData) => {
                            if (aterr) {
                                return res
                                    .status(500)
                                    .send({ success: false, message: 'Internal server error' });
                            }

                            var EmployeeMonthlyPay = {
                                UniqueEmpId: empData._id,
                                Month: atndcData.Month,
                                Year: atndcData.Year,
                                NoOfDaysWorked: atndcData.NoOfDaysWorked,
                                NoOfLeaves: atndcData.NoOfLeaves,
                                NoOfWorkingDays: atndcData.NoOfWorkingDays,
                                NoOfOTDays: atndcData.NoOfOTDays,
                                OTWages: atndcData.OTWages,
                                TDSAmount: atndcData.TDSAmount,
                                AdvanceAmount: atndcData.AdvanceAmount,
                                UniformFee: atndcData.UniformFee,
                                FineAmount: atndcData.FineAmount,
                                OtherDeductionAmount: atndcData.OtherDeductionAmount,
                                SalaryAfterDeduction: atndcData.SalaryAfterDeduction,
                                EmployeeCode: empData.UniqueEmpId,
                                EmployeeName: empData.FullName,
                                EmployeeDesignation: empData.WorkOrder.client.designation.name,
                                Aadhaar: empData.AadharNo,
                                BankAccountNo: empData.AccountNumber,
                                BankName: empData.BankName,
                                BankBranch: empData.Branch,
                                BankIFSC: empData.IFSC,
                                WorkBranch: empData.WorkOrderRole.branchName,
                                UAN: empData.UniversalAccount,
                                ESI: empData.ESI,
                                GrossSalary: empData.GrossSalary,
                                DeductedSalary: empData.DeductedSalary,
                                NetSalary: empData.NetSalary,
                                BasicVDA: empData.BasicVDA,
                                Conveyance: empData.Conveyance,
                                ESIAmount: empData.ESIAmount,
                                Gratuity: empData.Gratuity,
                                HRA: empData.HRA,
                                Bonus: empData.Bonus,
                                LeaveWages: empData.LeaveWithWages,
                                MedicalAllowance: empData.MedicalAllowance,
                                NationalFestivalHolidays: empData.NationalFestivalHolidays,
                                PFAmount: empData.PFAmount,
                                ProfessionalTax: empData.ProfessionalTax,
                                RelieverCharges: empData.RelieverCharges,
                                SpecialAllowance: empData.SpecialAllowance,
                                WashingAllowance: empData.WashingAllowance,

                                EWBasiVDA: atndcData.EWBasiVDA,
                                EWHRA: atndcData.EWHRA,
                                EWConveyance: atndcData.EWConveyance,
                                EWMedicalAllowance: atndcData.EWMedicalAllowance,
                                EWSpecialAllowance: atndcData.EWSpecialAllowance,
                                EWBonus: atndcData.EWBonus,
                                EWLeaveWages: atndcData.EWLeaveWages,
                                EWWashingAllowance: atndcData.EWWashingAllowance,
                                EWNationalFestivalHolidays: atndcData.EWNationalFestivalHolidays,
                                EWPFbasedBAsicVDA: atndcData.EWPFbasedBAsicVDA,
                                EWESI: atndcData.EWESI,
                                TotalFixedWages: atndcData.TotalFixedWages,
                                TotalEarnedWages: atndcData.TotalEarnedWages,
                                Deduction: atndcData.Deduction,
                                TotalNetPayable: atndcData.TotalNetPayable,

                                GeneratedOn: new Date(),
                            }

                            return res
                                .status(200)
                                .send({
                                    success: true,
                                    data: EmployeeMonthlyPay
                                });
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


// exports.getPaySlip = async function (req, res) {
//     BillModel
//         .find({ isDeleted: false })
//         .populate({
//             path: 'Employees',
//             populate: {
//                 path: "Employee",
//                 populate: {
//                     path: "WorkOrderRole",
//                     populate: {
//                         path: "role"
//                     }
//                 }
//             }
//         })
//         .exec((err, result) => {
//             if (err) {
//                 return res
//                     .status(500)
//                     .send({ success: true, message: 'Internal server error' })
//             }
//             return res
//                 .status(200)
//                 .send({ success: true, data: result })
//         })
// }


// exports.getPaySlipById = async function (req, res) {
//     const { error, value } = BillValidations
//         .validate(BillValidations.ValidationTypes.BILL_ID, req.body);

//     if (error) {
//         return res
//             .status(400)
//             .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
//     }
//     else {
//         await BillModel
//             .findOne({ _id: value.id })
//             .populate({
//                 path: 'Employees',
//                 populate: {
//                     path: "Employee",
//                     populate: {
//                         path: "WorkOrderRole",
//                         populate: {
//                             path: "role"
//                         }
//                     }
//                 }
//             })
//             .populate({
//                 path: 'WorkOrder',
//                 populate: {
//                     path: "client",
//                 }
//             })
//             .populate({
//                 path: "Payments",
//                 populate: {
//                     path: "PaymentMode"
//                 }
//             })
//             .exec((err, result) => {
//                 if (err) {
//                     return res
//                         .status(500)
//                         .send({ success: true, message: 'Internal server error' })
//                 }
//                 return res
//                     .status(200)
//                     .send({ success: true, data: result })
//             })
//     }
// }


exports.getSalaryStatement = async function (req, res) {
    const { error, value } = BillValidations
        .validate(BillValidations.ValidationTypes.WORKORDER_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    BillModel
        .find({ WorkOrder: value.id })
        .populate({
            path: 'Employees',
            populate: {
                path: "Employee",
                populate: [
                    { path: "Attendance" },
                    { path: "Gender" },
                    {
                        path: "WorkOrderRole",
                        populate: {
                            path: "role"
                        }
                    }]
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



// exports.getSalaryStatement = async function (req, res) {
//     const { error, value } = BillValidations
//         .validate(BillValidations.ValidationTypes.WORKORDER_ID, req.body);

//     if (error) {
//         return res
//             .status(400)
//             .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
//     }
//     try {

//         BillModel
//             .find({ WorkOrder: value.id })
//             .populate({
//                 path: 'Employees',
//                 populate: {
//                     path: "Employee",
//                     populate: [
//                         { path: "Attendance" },
//                         { path: "Gender" },
//                         {
//                             path: "WorkOrderRole",
//                             populate: {
//                                 path: "role"
//                             }
//                         }]
//                 }
//             })
//             .exec((err, result) => {
//                 if (err) {
//                     return res
//                         .status(500)
//                         .send({ success: true, message: 'Internal server error' })
//                 }

//                 // const start =  new Date().getTime()
//                 // const end=new Date()
//                 // end.setHours(23,59,59,999)
//                 // end.getTime()
                
//                 // let resOut = result.Employees.Employee.Attendance.filter(item => {
//                 //    let date = new Date(item.createdAt).getTime();
//                 //    return date >= start && date <= end;
//                 // })


//                 // let dataResult = [];
//                 // dataResult = result.forEach(eleBill => {
//                 //     eleBill.Employees.forEach(eleEmp => {
//                 //         eleEmp.Employee.Attendance.forEach(item => {
//                 //             item.filter(x => x.Month == eleBill.Month && x.Year == eleBill.Year)
//                 //         })
//                 //     })
//                 // });

//                 // var dataOutput = dataResult;

//                 return res
//                     .status(200)
//                     .send({ success: true, data: result });
//             })
//     }
//     catch (error) {
//         return res
//             .status(500)
//             .send({ success: false, message: 'Internal server error' });
//     }
// }