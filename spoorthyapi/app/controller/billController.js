const EmployeeModel = require("../model/employee");
const GeneralUtils = require("../utils/generalUtils");
const BillValidations = require("../validations/billValidations");
const BillModel = require("../model/bill");
const PaymentModel = require("../model/payment");
const AttendanceModel = require("../model/attendance");
const PaySlipGenerationService = require("../service/payslipGenerationService");
const Enum = require("../constants/enum");
const path = require("path");
const fs = require("fs");
const PdfPrinter = require("pdfmake");
const HtmlPdf = require("html-pdf");
const moment = require("moment");

exports.getBill = async function (req, res) {
  BillModel.find({ isDeleted: false })
    .populate({
      path: "Employees",
      populate: {
        path: "Employee",
        populate: {
          path: "WorkOrderRole",
          populate: {
            path: "role",
          },
        },
      },
    })
    .exec((err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ success: true, message: "Internal server error" });
      }
      return res.status(200).send({ success: true, data: result });
    });
};

exports.getBillByWorkOrderAllData = async function (req, res) {
  const { error, value } = BillValidations.validate(
    BillValidations.ValidationTypes.WORKORDER_ID,
    req.body
  );

  if (error) {
    return res.status(400).send({
      success: false,
      message: GeneralUtils.getJoiErrorMessage(error),
    });
  }

  BillModel.find({ WorkOrder: value.id })
    .populate({
      path: "Employees",
      populate: {
        path: "Employee",
        populate: {
          path: "WorkOrderRole",
          populate: {
            path: "role",
          },
        },
      },
    })
    .exec((err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ success: true, message: "Internal server error" });
      }
      return res
        .status(200)
        .send({ success: true, data: result })
    });
};

exports.getBillByWorkOrder = async function (req, res) {
  const { error, value } = BillValidations.validate(
    BillValidations.ValidationTypes.WORKORDER_ID,
    req.body
  );

  if (error) {
    return res.status(400).send({
      success: false,
      message: GeneralUtils.getJoiErrorMessage(error),
    });
  }

  BillModel.find({ WorkOrder: value.id })
    .populate({
      path: "Employees",
      populate: {
        path: "Employee",
        populate: {
          path: "WorkOrderRole",
          populate: {
            path: "role",
          },
        },
      },
    })
    .exec((err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ success: true, message: "Internal server error" });
      }
      // return res
      //     .status(200)
      //     .send({ success: true, data: result })

      let searchText = value.searchText;
      if (searchText && searchText.length > 1) {
        searchText = searchText.toString().toLowerCase();
        result = result.filter(item => {
          return (item.BillId && item.BillId.toString().toLowerCase().indexOf(searchText) !== -1) ||
            (item.BillStatus && item.BillStatus.toLowerCase().indexOf(searchText) !== -1) ||
            (item.Month && item.Month.toLowerCase().indexOf(searchText) !== -1) ||
            (item.Year && item.Year.toString().toLowerCase().indexOf(searchText) !== -1) || !searchText;
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


    });
};

exports.getBillByMonthandClient = async function (req, res) {
  const { error, value } = BillValidations.validate(
    BillValidations.ValidationTypes.MONTH_CLIENT_ID,
    req.body
  );

  if (error) {
    return res.status(400).send({
      success: false,
      message: GeneralUtils.getJoiErrorMessage(error),
    });
  }
  if (value.id == "All") {
    BillModel.find({ Month: value.Month })
      .populate({
        path: "WorkOrder",
        populate: {
          path: "client",
        },
      })
      .populate({
        path: "Employees",
        populate: {
          path: "Employee",
          populate: [
            { path: "Attendance" },
            { path: "Gender" },
            {
              path: "WorkOrderRole",
              populate: {
                path: "role",
              },
            },
          ],
        },
      })
      .exec((err, result) => {
        if (err) {
          return res
            .status(500)
            .send({ success: true, message: "Internal server error" });
        }

        var distinctWorkIds = result
          .map((x) => x.WorkOrder.name)
          .filter((x, i, a) => a.indexOf(x) == i);

        var groupBy = function (xs, key) {
          return xs.filter((x) => x.WorkOrder.name == key);
        };

        var groupedArray = [];
        distinctWorkIds.forEach((x) =>
          groupedArray.push({
            TableName: x,
            billItems: groupBy(result, x),
          })
        );

        return res.status(200).send({ success: true, data: groupedArray });
      });
  } else {
    BillModel.find({ Client: value.id, Month: value.Month })
      .populate({
        path: "WorkOrder",
        populate: {
          path: "client",
        },
      })
      .exec((err, result) => {
        if (err) {
          return res
            .status(500)
            .send({ success: true, message: "Internal server error" });
        }

        var distinctWorkIds = result
          .map((x) => x.WorkOrder.name)
          .filter((x, i, a) => a.indexOf(x) == i);

        var groupBy = function (xs, key) {
          return xs.filter((x) => x.WorkOrder.name == key);
        };

        var groupedArray = [];
        distinctWorkIds.forEach((x) =>
          groupedArray.push({
            TableName: x,
            billItems: groupBy(result, x),
          })
        );

        return res.status(200).send({ success: true, data: groupedArray });
      });
  }
};

exports.getBillByDate = async function (req, res) {
  const { error, value } = BillValidations.validate(
    BillValidations.ValidationTypes.GET_DATE,
    req.body
  );

  if (error) {
    return res.status(400).send({
      success: false,
      message: GeneralUtils.getJoiErrorMessage(error),
    });
  }

  BillModel.find({ Month: value.Month, Year: value.Year })
    .populate({
      path: "WorkOrder",
      populate: {
        path: "client",
      },
    })
    .exec((err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ success: true, message: "Internal server error" });
      }
      return res.status(200).send({ success: true, data: result });
    });
};

exports.getBillNotGenerated = async function (req, res) {
  BillModel.find({ isDeleted: false, isGenerated: false })
    .populate({
      path: "WorkOrder",
      populate: {
        path: "client",
      },
    })
    .exec((err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ success: true, message: "Internal server error" });
      }
      return res.status(200).send({ success: true, data: result });
    });
};

exports.getPostBillNotGenerated = async function (req, res) {
  BillModel.find({ isDeleted: false, isGenerated: false })
    .populate({
      path: "WorkOrder",
      populate: {
        path: "client",
      },
    })
    .exec((err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ success: true, message: "Internal server error" });
      }
      // return res
      //     .status(200)
      //     .send({ success: true, data: result })

      let resdata =
        result && result.length > 0
          ? result.slice(
            req.body.skip ? req.body.skip : 0,
            (req.body.skip ? req.body.skip : 0) +
            (req.body.limit ? req.body.limit : 10)
          )
          : [];
      return res.status(200).send({
        success: true,
        data: {
          result: resdata,
          total: result && result.length > 0 ? result.length : 0,
        },
      });
    });
};

exports.getBillNotPaid = async function (req, res) {
  BillModel.find({ isDeleted: false, isPaid: false, isGenerated: true })
    .populate({
      path: "WorkOrder",
      populate: {
        path: "client",
      },
    })
    .exec((err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ success: true, message: "Internal server error" });
      }
      return res.status(200).send({ success: true, data: result });
    });
};

exports.getPostBillNotPaid = async function (req, res) {
  BillModel.find({ isDeleted: false, isPaid: false, isGenerated: true })
    .populate({
      path: "WorkOrder",
      populate: {
        path: "client",
      },
    })
    .exec((err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ success: true, message: "Internal server error" });
      }
      // return res
      //     .status(200)
      //     .send({ success: true, data: result })

      let resdata =
        result && result.length > 0
          ? result.slice(
            req.body.skip ? req.body.skip : 0,
            (req.body.skip ? req.body.skip : 0) +
            (req.body.limit ? req.body.limit : 10)
          )
          : [];
      return res.status(200).send({
        success: true,
        data: {
          result: resdata,
          total: result && result.length > 0 ? result.length : 0,
        },
      });
    });
};

exports.getBillById = async function (req, res) {
  const { error, value } = BillValidations.validate(
    BillValidations.ValidationTypes.BILL_ID,
    req.body
  );

  if (error) {
    return res.status(400).send({
      success: false,
      message: GeneralUtils.getJoiErrorMessage(error),
    });
  } else {
    await BillModel.findOne({ _id: value.id })
      .populate({
        path: "Employees",
        populate: {
          path: "Employee",
          populate: {
            path: "WorkOrderRole",
            populate: {
              path: "role",
            },
          },
        },
      })
      .populate({
        path: "WorkOrder",
        populate: {
          path: "client",
        },
      })
      .populate({
        path: "Payments",
        populate: {
          path: "PaymentMode",
        },
      })
      .populate({
        path: "billAbstract",
      })
      .exec((err, result) => {
        if (err) {
          return res
            .status(500)
            .send({ success: true, message: "Internal server error" });
        }
        return res.status(200).send({ success: true, data: result });
      });
  }
};

exports.saveEditBill = async function (req, res) {
  const { error, value } = BillValidations.validate(
    BillValidations.ValidationTypes.SAVE_BILL,
    req.body
  );

  if (error) {
    return res.status(400).send({
      success: false,
      message: GeneralUtils.getJoiErrorMessage(error),
    });
  }

  try {
    if (req.body.Employees) {
      const { success, message } = await BillValidations.validateEmployees(
        req.body.Employees
      );
      if (!success) {
        return res.status(400).send({ success: false, message: message });
      }
    }

    var BillData = {
      WorkOrder: value.WorkOrder,
      Client: value.Client,
      Employees: value.Employees,
      Month: value.Month,
      Year: value.Year,
      GeneratedOn: new Date(),
    };

    if (value.id) {
      await BillModel.updateOne({ _id: value.id }, { $set: BillData });

      return res.status(200).send({
        success: true,
        message: "Bill Details Updated successfully",
        data: { _id: value.id },
      });
    } else {
      var BillModelData = new BillModel(BillData);
      BillModelData.save(async (err, result) => {
        if (err) {
          return res
            .status(500)
            .send({ success: false, message: "Bill Detail already exists!" });
        }

        await BillModel.updateOne(
          { _id: BillModelData.id },
          { $set: BillModelData }
        ).exec(async (err, result1) => {
          if (err) {
            return res
              .status(500)
              .send({ success: false, message: "Internal server error" });
          }

          return res.status(200).send({
            success: true,
            message: "Bill Details Saved Successfully",
            data: result,
          });
        });
      });
    }
  } catch {
    console.log("error - controller ", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

exports.saveEditBillAbstract = async function (req, res) {
  // const { error, value } = BillValidations
  // .validate(BillValidations.ValidationTypes.SAVE_BILL, req.body)

  // if (error) {
  //     return res
  //         .status(400)
  //         .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
  // }
  try {
    var BillData = {
      billAbstract: req.body.billAbstract,
    };

    if (req.body.id) {
      await BillModel.updateOne({ _id: req.body.id }, { $set: BillData });

      return res.status(200).send({
        success: true,
        message: "Bill Details Updated successfully",
        data: { _id: req.body.id },
      });
    } else {
      var BillModelData = new BillModel(BillData);
      BillModelData.save(async (err, result) => {
        if (err) {
          return res
            .status(500)
            .send({ success: false, message: "Bill Detail already exists!" });
        }

        await BillModel.updateOne(
          { _id: BillModelData.id },
          { $set: BillModelData }
        ).exec(async (err, result1) => {
          if (err) {
            return res
              .status(500)
              .send({ success: false, message: "Internal server error" });
          }

          return res.status(200).send({
            success: true,
            message: "Bill Details Saved Successfully",
            data: result,
          });
        });
      });
    }
  } catch {
    console.log("error - controller ", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

exports.generateBill = async function (req, res) {
  const { error, value } = BillValidations.validate(
    BillValidations.ValidationTypes.SAVE_BILL,
    req.body
  );

  if (error) {
    return res.status(400).send({
      success: false,
      message: GeneralUtils.getJoiErrorMessage(error),
    });
  }

  try {
    await BillModel.findOne({ _id: value.id })
      .populate({
        path: "WorkOrder",
        populate: {
          path: "client",
        },
        populate: {
          path: "workOrderRoles",
          populate: {
            path: "role",
          },
        },
      })
      .populate({
        path: "Employees",
        populate: {
          path: "Employee",
        },
      })
      .exec(async (err, result) => {
        if (err) {
          return res
            .status(500)
            .send({ success: false, message: "Bill does not exist!" });
        }

        let overAllHired = 0;
        let overAllManDays = 0;
        let overAllManDaysBA = 0;

        for (const item of result.billAbstract) {
          overAllManDaysBA += item.TotalNoOfManDays;
        }
        for (const data of result.Employees) {
          overAllHired += data.Employee.Status == "Hired" ? 1 : 0;
          overAllManDays += data.NoOfDaysWorked;

          let NoOfWorkingDays = data.NoOfDaysWorked + data.NoOfLeaves;

          let resEWBasiVDA = Math.round(
            ((data.Employee.BasicVDA ? data.Employee.BasicVDA : 0) / NoOfWorkingDays) * data.NoOfDaysWorked
          );
          let EWBasiVDA = (+(resEWBasiVDA.toFixed(2)));

          let resEWHRA = Math.round(
            ((data.Employee.HRA ? data.Employee.HRA : 0) / NoOfWorkingDays) * data.NoOfDaysWorked
          );
          let EWHRA = (+(resEWHRA.toFixed(2)));

          let resEWConveyance = Math.round(
            ((data.Employee.Conveyance ? data.Employee.Conveyance : 0) / NoOfWorkingDays) * data.NoOfDaysWorked
          );
          let EWConveyance = (+(resEWConveyance.toFixed(2)));

          let resEWMedicalAllowance = Math.round(
            ((data.Employee.MedicalAllowance ? data.Employee.MedicalAllowance : 0) / NoOfWorkingDays) *
            data.NoOfDaysWorked
          );
          let EWMedicalAllowance = (+(resEWMedicalAllowance.toFixed(2)));

          let resEWSpecialAllowance = Math.round(
            ((data.Employee.SpecialAllowance ? data.Employee.SpecialAllowance : 0) / NoOfWorkingDays) *
            data.NoOfDaysWorked
          );
          let EWSpecialAllowance = (+(resEWSpecialAllowance.toFixed(2)));

          let resEWBonus = Math.round(
            ((data.Employee.Bonus ? data.Employee.Bonus : 0) / NoOfWorkingDays) * data.NoOfDaysWorked
          );
          let EWBonus = (+(resEWBonus.toFixed(2)));

          let resEWLeaveWages = Math.round(
            ((data.Employee.LeaveWithWages ? data.Employee.LeaveWithWages : 0) / NoOfWorkingDays) *
            data.NoOfDaysWorked
          );
          let EWLeaveWages = (+(resEWLeaveWages.toFixed(2)));

          let resEWWashingAllowance = Math.round(
            ((data.Employee.WashingAllowance ? data.Employee.WashingAllowance : 0) / NoOfWorkingDays) *
            data.NoOfDaysWorked
          );
          let EWWashingAllowance = (+(resEWWashingAllowance.toFixed(2)));

          let resEWNationalFestivalHolidays = Math.round(
            ((data.Employee.NationalFestivalHolidays ? data.Employee.NationalFestivalHolidays : 0) / NoOfWorkingDays) *
            data.NoOfDaysWorked
          );
          let EWNationalFestivalHolidays = (+(resEWNationalFestivalHolidays.toFixed(2)));

          let resTotalFixedWages = Math.round(
            (+(data.Employee.BasicVDA ? data.Employee.BasicVDA : 0)) +
            (+(data.Employee.HRA ? data.Employee.HRA : 0)) +
            (+(data.Employee.Conveyance ? data.Employee.Conveyance : 0)) +
            (+(data.Employee.MedicalAllowance ? data.Employee.MedicalAllowance : 0)) +
            (+(data.Employee.SpecialAllowance ? data.Employee.SpecialAllowance : 0)) +
            (+(data.Employee.Bonus ? data.Employee.Bonus : 0)) +
            (+(data.Employee.LeaveWithWages ? data.Employee.LeaveWithWages : 0)) +
            (+(data.Employee.WashingAllowance ? data.Employee.WashingAllowance : 0)) +
            (+(data.Employee.NationalFestivalHolidays ? data.Employee.NationalFestivalHolidays : 0))
          );
          let TotalFixedWages = (+(resTotalFixedWages.toFixed(2)));

          let resTotalEarnedWages = Math.round(
            +EWBasiVDA +
            +EWHRA +
            +EWConveyance +
            +EWMedicalAllowance +
            +EWSpecialAllowance +
            +EWBonus +
            +EWLeaveWages +
            +EWWashingAllowance +
            +EWNationalFestivalHolidays +
            +data.OTWages
          );
          let TotalEarnedWages = resTotalEarnedWages.toFixed(2);

          const hasPFAmount = data.Employee.deductionType.includes("PF Amount");
          let EWPFbasedBAsicVDA = 0;
          if (hasPFAmount) {
            let resEWPFbasedBAsicVDA = Math.round(EWBasiVDA * 0.12);
            EWPFbasedBAsicVDA = (+(resEWPFbasedBAsicVDA.toFixed(2)));
          }

          const hasPTAmount = data.Employee.deductionType.includes("Professional Tax");
          let EWPT = 0;
          if (hasPTAmount && (EWBasiVDA >= 25000)) {
            EWPT = 200;
          }


          const hasESIAmount = data.Employee.deductionType.includes("ESI Amount");
          let EWESI = 0;
          if (hasESIAmount) {
            if (data.Employee.ESIBasedOn == "BASICVDA" && (EWBasiVDA <= 21000)) {
              let resEWESI = Math.round(EWBasiVDA * 0.0075);
              EWESI = (+(resEWESI.toFixed(2)));
            }
            else if (data.Employee.ESIBasedOn == "NETSAL" && (TotalEarnedWages <= 21000)) {
              let resEWESI = +TotalEarnedWages * 0.0075;
              EWESI = (+(resEWESI.toFixed(2)));
            }
          }

          let resDeduction = Math.round(
            +EWPFbasedBAsicVDA +
            +EWESI +
            +EWPT +
            +data.TDSAmount +
            +data.AdvanceAmount +
            +data.UniformFee +
            +data.FineAmount +
            +data.OtherDeductionAmount
          );
          let Deduction = (+(resDeduction.toFixed(2)));

          let resTotalNetPayable = Math.round(TotalEarnedWages - Deduction);
          let TotalNetPayable = (+(resTotalNetPayable.toFixed(2)));

          const employee = await EmployeeModel.findOne({
            _id: data.Employee._id,
          });
          // .exec(async (err, employee) => {
          //     if (err) {
          //         return res
          //             .status(500)
          //             .send({ success: false, message: 'Employee not found!' })
          //     }

          let AttendanceDetail = {
            Employee: data.Employee._id,
            Month: result.Month,
            Year: result.Year,
            NoOfDaysWorked: +data.NoOfDaysWorked,
            NoOfLeaves: +data.NoOfLeaves,
            NoOfOTDays: +data.NoOfOTDays,
            OTWages: +data.OTWages,
            NoOfWorkingDays: +(data.NoOfDaysWorked + data.NoOfLeaves),
            TDSAmount: +data.TDSAmount,
            AdvanceAmount: +data.AdvanceAmount,
            UniformFee: +data.UniformFee,
            FineAmount: +data.FineAmount,
            OtherDeductionAmount: +data.OtherDeductionAmount,
            SalaryAfterDeduction: +data.SalaryAfterDeduction,
            EWBasiVDA: +EWBasiVDA,
            EWHRA: +EWHRA,
            EWConveyance: +EWConveyance,
            EWMedicalAllowance: +EWMedicalAllowance,
            EWSpecialAllowance: +EWSpecialAllowance,
            EWBonus: +EWBonus,
            EWLeaveWages: +EWLeaveWages,
            EWWashingAllowance: +EWWashingAllowance,
            EWNationalFestivalHolidays: +EWNationalFestivalHolidays,
            EWPFbasedBAsicVDA: +EWPFbasedBAsicVDA,
            EWPT: +EWPT,
            EWESI: +EWESI,
            TotalFixedWages: +TotalFixedWages,
            TotalEarnedWages: +TotalEarnedWages,
            Deduction: +Deduction,
            TotalNetPayable: +TotalNetPayable,
          };

          console.log('AttendanceDetail:', AttendanceDetail)
          let AttendanceData = new AttendanceModel(AttendanceDetail);
          // employee.Attendance = (employee.Attendance && employee.Attendance.length > 0) ? employee.Attendance : [];
          const attendance = await AttendanceData.save();
          // async (err, attendance) => {
          if (attendance && attendance._id) {
            employee.Attendance.push(attendance._id);
          }

          await EmployeeModel.updateOne(
            { _id: data.Employee._id },
            { $set: employee }
          );
          // .exec((err) => {
          //     if (err) {
          //         return res
          //             .status(500)
          //             .send({ success: false, message: 'Employee not found!' })
          //     }
          // })
          //     })
          // })
        }

        BillModel.findOne({ _id: value.id })
          .populate({
            path: "WorkOrder",
            populate: {
              path: "Client",
            },
            populate: {
              path: "workOrderRoles",
              populate: {
                path: "role",
              },
            },
          })
          .populate({
            path: "Employees",
            populate: {
              path: "Employee",
            },
          })
          .populate({
            path: "Client",
            populate: {
              path: "designation",
            },
          })
          .exec(async (err, bill) => {
            if (err) {
              return res
                .status(400)
                .send({ success: false, message: "Bill does not exist!" });
            }
            let BillData = {
              DueDate: value.DueDate,
              GrossAmount: value.GrossAmount,
              isGenerated: true,
              CGST: value.CGST,
              SGST: value.SGST,
              IGST: value.IGST,
              TDS: value.TDS,
              TDSCGST: value.TDSCGST,
              TDSSGST: value.TDSSGST,
              CGSTAmount: value.CGSTAmount,
              SGSTAmount: value.SGSTAmount,
              TotalAmount: value.TotalAmount,
              TotalBillAmount: value.TotalBillAmount,
              OverAllHired: overAllHired,
              OverAllManDays: overAllManDays,
              OverAllManDaysBA: overAllManDaysBA,
            };

            BillModel.updateOne({ _id: value.id }, { $set: BillData }).exec(
              (err) => {
                if (err) {
                  return res
                    .status(500)
                    .send({ success: false, message: "Bill not found!" });
                }
              }
            );

            bill.DueDate = value.DueDate;
            bill.GrossAmount = value.GrossAmount;
            bill.isGenerated = true;
            bill.CGST = value.CGST;
            bill.SGST = value.SGST;
            bill.IGST = value.IGST;
            bill.TDS = value.TDS;
            bill.TDSCGST = value.TDSCGST;
            bill.TDSSGST = value.TDSSGST;
            bill.CGSTAmount = value.CGSTAmount;
            bill.SGSTAmount = value.SGSTAmount;
            bill.TotalAmount = value.TotalAmount;
            bill.TotalBillAmount = value.TotalBillAmount;
            bill.OverAllHired = overAllHired;
            bill.OverAllManDays = overAllManDays;
            bill.OverAllManDaysBA = overAllManDaysBA;

            let genInvoice = GeneralUtils.generateBillInvoice(bill);
            if (!genInvoice.success) {
              return res.status(400).send({
                success: false,
                data: genInvoice.data,
                message: genInvoice.msg,
              });
            }
            let invoiceURL = { InvoiceURL: genInvoice.data };
            // BillData.InvoiceURL = genInvoice.data;

            BillModel.updateOne({ _id: value.id }, { $set: invoiceURL }).exec(
              (err) => {
                if (err) {
                  return res
                    .status(500)
                    .send({ success: false, message: "Bill not found!" });
                }
              }
            );

            return res.status(200).send({
              success: true,
              message: "Invoice created successfully",
              data: bill,
            });
          });
      });
  } catch (err) {
    console.log("error - controller ", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

exports.addPaymentToBill = async function (req, res) {
  const { error, value } = BillValidations.validate(
    BillValidations.ValidationTypes.ADD_PAYMENT,
    req.body
  );

  if (error) {
    return res.status(400).send({
      success: false,
      message: GeneralUtils.getJoiErrorMessage(error),
    });
  } else {
    var PaymentDetail = {
      BillId: value.BillId,
      PaymentMode: value.PaymentMode,
      UTR: value.UTR,
      AmountReceived: value.AmountReceived,
      PaymentReceivedOn: value.PaymentReceivedOn,
      Remarks: value.Remarks,
      VerifiedBy: value.VerifiedBy,
    };

    try {
      await BillModel.findOne({ _id: value.BillId }).exec(async (err, bill) => {
        if (err) {
          return res
            .status(500)
            .send({ success: false, message: "Internal server error" });
        }

        if (value.AmountReceived > bill.GrossAmount - bill.AmountReceived) {
          return res.status(400).send({
            success: false,
            message: "Payment exceeds Pending Balance",
          });
        } else {
          var PaymentData = new PaymentModel(PaymentDetail);
          const result = await PaymentData.save();
          if (result && result._id) {
            bill.Payments.push(result._id);
            bill.AmountReceived = bill.AmountReceived + value.AmountReceived;
            if (bill.AmountReceived != bill.GrossAmount) {
              bill.BillStatus = Enum.BILL_STATUS.PARTIALLY_PAID;
              bill.LastPaidOn = new Date();
            } else {
              bill.BillStatus = Enum.BILL_STATUS.PAID;
              bill.isPaid = true;
              bill.LastPaidOn = new Date();
            }
          } else {
            return res
              .status(500)
              .send({ success: false, message: "Internal server error" });
          }

          await BillModel.updateOne({ _id: value.BillId }, { $set: bill }).exec(
            (err, result1) => {
              if (err) {
                return res
                  .status(500)
                  .send({ success: false, message: "Internal server error" });
              }

              return res
                .status(200)
                .send({ success: true, message: "Payment Added", data: bill });
            }
          );
        }
      });
    } catch {
      console.log("error - controller ", error);
      return res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  }
};

// exports.getBillInvoice = async function (req, res, callback) {
//     const { error, value } = BillValidations
//         .validate(BillValidations.ValidationTypes.BILL_ID, req.body)

//     if (error) {
//         return res
//             .status(400)
//             .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
//     }
//     try {
//         await BillModel
//             .findOne({ _id: value.id })
//             .populate({
//                 path: 'WorkOrder',
//                 populate: {
//                     path: "client"
//                 },
//                 populate: {
//                     path: 'workOrderRoles',
//                     populate: {
//                         path: 'role'
//                     }
//                 }
//             })
//             .populate({
//                 path: "Employees",
//                 populate: {
//                     path: "Employee"
//                 }
//             })
//             .exec(async (err, billData) => {
//                 if (err) {
//                     return res
//                         .status(500)
//                         .send({ success: false, message: 'Bill does not exist!' })
//                 }

//                 const sourceFilePath = path.join(__dirname, '../assets/templates/bill.html');
//                 const destinationFilePath = path.join(__dirname, '../../public/uploads/invoiceFiles/');
//                 const destinationFileName = new Date().getTime() + ".pdf";
//                 var htmlData = fs.readFileSync(sourceFilePath, 'utf8');
//                 const options = {
//                     hieght: '1200'
//                 };
//                 const billInfo = billData;
//                 const workOrderData = billInfo.WorkOrder;
//                 const workOrderRoles = workOrderData.workOrderRoles;
//                 const clientData = workOrderData.client;
//                 const woEmployees = billInfo.Employees;

//                 htmlData = htmlData.replace(/{{ authority }}/g, `${clientData.name}`)
//                 htmlData = htmlData.replace(/{{ companyName }}/g, `${clientData.name}`)
//                 htmlData = htmlData.replace(/{{ companyAddress}}/g, `${clientData.address}`)
//                 htmlData = htmlData.replace(/{{ companyLocation }}/g, `${clientData.address}`)
//                 htmlData = htmlData.replace(/{{companyPincode}}/g, `${clientData.pinCode}`)
//                 htmlData = htmlData.replace(/{{ companyGSTIN }}/g, `${clientData.GSTIN}`)
//                 htmlData = htmlData.replace(/{{ billInvoiceNumber }}/g, `${billInfo.BillId}`)
//                 htmlData = htmlData.replace(/{{ billInvoiceDate }}/g, `${moment(billInfo.GeneratedOn).format('DD-MM-YYYY')}`)
//                 htmlData = htmlData.replace(/{{ billPayFrom }}/g, `${moment(billInfo.GeneratedOn).format('DD-MM-YYYY')}`)
//                 htmlData = htmlData.replace(/{{ billDueDate }}/g, `${moment(billInfo.DueDate).format('DD-MM-YYYY')}`)

//                 if (workOrderRoles && workOrderRoles.length > 0) {
//                     workOrderRoles.forEach((woRole, ix) => {
//                         let woRoleEmpl = (woEmployees && woEmployees.length > 0) ?
//                             woEmployees.filter(ee => {
//                                 let emWid = ee.Employee.WorkOrderRole.toString();
//                                 let Wid = woRole._id.toString();
//                                 return emWid == Wid;
//                             }) : [];
//                         let workedDays = 0;
//                         let workedDaySalary = 0;
//                         if (woRoleEmpl && woRoleEmpl.length > 0) {
//                             workedDays = +(woRoleEmpl.reduce((sum, curr) => sum + (+(curr['NoOfDaysWorked'] ? curr['NoOfDaysWorked'] : 0)), 0));
//                             workedDaySalary = +(woRoleEmpl.reduce((sum, curr) => sum + (+(curr['SalaryAfterDeduction'] ? curr['SalaryAfterDeduction'] : 0)), 0));
//                         }

//                         let rpaticulars = `<tr>
//                                                 <td>${ix + 1}</td>
//                                                 <td>${woRole?.role?.name}</td>
//                                                 <td>${woRole?.hired}</td>
//                                                 <td>${workedDays}</td>
//                                                 <td>${woRole?.salary}</td>
//                                                 <td>${workedDaySalary}</td>
//                                             </tr>`;
//                         htmlData = htmlData.replace(/{{ particularsList }}/g, `${rpaticulars}`);
//                     });
//                 }

//                 htmlData = htmlData.replace(/{{ overallTotalQTY }}/g, `${billInfo.OverAllHired}`);
//                 htmlData = htmlData.replace(/{{ overallnoOfManDays }}/g, `${billInfo.OverAllManDays}`);
//                 htmlData = htmlData.replace(/{{ totalAmountinRS }}/g, `${billInfo.TotalAmount}`);
//                 htmlData = htmlData.replace(/{{ totalCGST }}/g, `${billData.CGSTAmount}`);
//                 htmlData = htmlData.replace(/{{ totalSGST }}/g, `${billData.SGSTAmount}`);
//                 htmlData = htmlData.replace(/{{ overallTotalAmount }}/g, `${billData.GrossAmount}`);
//                 htmlData = htmlData.replace(/{{ CGST }}/g, `${billInfo.CGST}`);
//                 htmlData = htmlData.replace(/{{ SGST }}/g, `${billInfo.SGST}`);

//                 let grandTotal = Math.ceil(billData.GrossAmount);
//                 let amtStr = GeneralUtils.convertAmount(grandTotal);
//                 htmlData = htmlData.replace(/{{ overallTotalRoundFiguredAmount }}/g, `${grandTotal}`);
//                 htmlData = htmlData.replace(/{{ overallTotalAmountinWords }}/g, `${amtStr}`)

//                 billData.InvoiceURL = `${process.env.DOCUMENT_BASE_PATH}invoiceFiles/${destinationFileName}`;

//                 await BillModel.updateOne({ _id: billData._id }, { $set: billData })

//                 HtmlPdf
//                     .create(htmlData, options)
//                     .toFile(destinationFilePath + destinationFileName, function (err, result) {
//                         if (err) {
//                             throw err;
//                         }

//                         callback('uploads/invoiceFiles/' + destinationFileName);
//                     });

//             })
//     } catch (err) {
//         console.log("error - controller ", error);
//         return res
//             .status(500)
//             .send({ success: false, message: 'Internal server error' });
//     }

// }

exports.generatePaySlipForBill = async function (req, res) {
  try {
    const pendingBills = await BillModel.find({
      isDeleted: false,
      $or: [{ isPaySlipGenerated: null }, { isPaySlipGenerated: false }],
    }).populate();
    console.log("Size ", pendingBills.length);
    const responseData = [];
    for (const pendingBill of pendingBills) {
      console.log("Year ", pendingBill.Year);
      console.log("Month ", pendingBill.Month);
      const files = [];
      if (
        Array.isArray(pendingBill.Employees) &&
        pendingBill.Employees.length > 0
      ) {
        for (const employee of pendingBill.Employees) {
          const employeeData = await EmployeeModel.findOne({
            _id: employee.Employee,
          })
            .populate({
              path: "WorkOrder",
              populate: {
                path: "client",
                populate: {
                  path: "designation",
                },
              },
            })
            .populate({
              path: "WorkOrderRole",
            });
          const attendanceData = await AttendanceModel.findOne({
            Employee: employeeData._id,
            Month: pendingBill.Month,
            Year: pendingBill.Year,
          });
          responseData.push({
            employee: employeeData,
            attendance: attendanceData,
          });
          const file = await PaySlipGenerationService.generatePayslip(
            employeeData,
            attendanceData
          );
          files.push(file);
        }
      }
      const payslipFileName = await PaySlipGenerationService.createZipArchive(
        files
      );
      const billData = {
        isPaySlipGenerated: true,
      };
      billData.payslipPath = `${payslipFileName}`;
      await BillModel.updateOne({ _id: pendingBill._id }, { $set: billData });
      break;
    }
    if (res) {
      return res.status(200).send({ success: true, data: responseData });
    }
  } catch (error) {
    if (res) {
      return res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  }
};
