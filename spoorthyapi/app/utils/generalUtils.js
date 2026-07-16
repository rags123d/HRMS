const axios = require('axios');
const BillModel = require('../model/bill');
const path = require('path');
const fs = require('fs');
const PdfPrinter = require('pdfmake');
const HtmlPdf = require('html-pdf');
const moment = require('moment');
const DesignationModel = require('../model/designation');

function getJoiErrorMessage(error) {
    var errorMessage = '';
    if (error && error.details) {
        error.details.forEach((err) => {
            errorMessage = errorMessage.concat(`${err.message}, `);
        });
        if (errorMessage.length > 2) {
            errorMessage = errorMessage.substr(0, errorMessage.length - 2);
        }
    }
    return errorMessage;
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000)
}

function decrypt(data) {
    return Buffer.from(data, 'base64').toString()
}

function encrypt(data) {
    return Buffer.from(data).toString('base64')
}

function sendOtp(otp, phoneNo) {
    return new Promise(async (resolve, reject) => {
        const message = `Please use OTP ${otp} to login.`;
        const URL = `https://api-alerts.kaleyra.com/v4/?api_key=A0d385f1e205cf141d6b9b3514fb79a17&method=sms&message=${message}&to=${phoneNo}&sender=DEODKS`
        axios(
            {
                url: URL,
                method: 'get'
            }
        ).then((result) => {
            resolve(otp)
        }).catch((error) => {
            console.log("SMS API error: ", error);
            resolve(otp)
        })

    })
}

const AMOUNT_UNITS = ["Zero", "One", "Two", "Three",
    "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven",
    "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"];

const AMOUNT_TENS = ["", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function convertAmount(amount) {
    let amount_int = amount;
    let amount_dec = Math.round((amount - (amount_int)) * 100);
    if (amount_dec == 0) {
        return wordConvert(amount_int) + " Only.";
    }
    else if (amount_dec > 0) {
        return wordConvert(amount_int) + " Rupees " + wordConvert(amount_dec) + " paise Only.";
    }
}
function wordConvert(i) {
    if (i < 20) {
        return AMOUNT_UNITS[i];
    }
    if (i < 100) {
        return AMOUNT_TENS[Math.floor(i / 10)] + ((i % 10 > 0) ? " " + wordConvert(i % 10) : "");
    }
    if (i < 1000) {
        return AMOUNT_UNITS[Math.floor(i / 100)] + " Hundred"
            + ((i % 100 > 0) ? " And " + wordConvert(i % 100) : "");
    }
    if (i < 100000) {
        return wordConvert(Math.floor(i / 1000)) + " Thousand "
            + ((i % 1000 > 0) ? " " + wordConvert(i % 1000) : "");
    }
    if (i < 10000000) {
        return wordConvert(Math.floor(i / 100000)) + " Lakh "
            + ((i % 100000 > 0) ? " " + wordConvert(i % 100000) : "");
    }
    if (i < 1000000000) {
        return wordConvert(Math.floor(i / 10000000)) + " Crore "
            + ((i % 10000000 > 0) ? " " + wordConvert(i % 10000000) : "");
    }
    return wordConvert(Math.floor(i / 1000000000)) + " Arab "
        + ((i % 1000000000 > 0) ? " " + wordConvert(i % 1000000000) : "");
}

function generateBillInvoice(billData) {
    if (!billData) {
        return { success: false, data: null, msg: "Invalid Bill data" };
    }
    try {
        const sourceFilePath = path.join(__dirname, '../assets/templates/bill.html');
        const destinationFilePath = path.join(__dirname, '../../public/uploads/invoiceFiles/');
        const destinationFileName = new Date().getTime() + ".pdf";
        var htmlData = fs.readFileSync(sourceFilePath, 'utf8');
        const options = {
            hieght: '1200'
        };
        const billInfo = billData;
        const billAbstract = billInfo.billAbstract;
        const workOrderData = billInfo.WorkOrder;
        const workOrderRoles = workOrderData.workOrderRoles;
        const clientData = billInfo.Client;
        const woEmployees = billInfo.Employees;

        const Montharr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        var fromDate = new Date(billInfo.Year, Montharr.indexOf(billInfo.Month), 1);
        var toDate = new Date(billInfo.Year, Montharr.indexOf(billInfo.Month) + 1, 0);

        htmlData = htmlData.replace(/{{ authority }}/g, `${clientData.designation.name}`)
        htmlData = htmlData.replace(/{{ companyName }}/g, `${clientData.name}`)
        htmlData = htmlData.replace(/{{ companyAddress}}/g, `${clientData.address}`)
        htmlData = htmlData.replace(/{{ companyLocation }}/g, `${clientData.address}`)
        htmlData = htmlData.replace(/{{companyPincode}}/g, `${clientData.pinCode}`)
        htmlData = htmlData.replace(/{{ companyGSTIN }}/g, `${clientData.GSTIN}`)
        htmlData = htmlData.replace(/{{ billInvoiceNumber }}/g, `${billInfo.BillId}`)
        htmlData = htmlData.replace(/{{ billInvoiceDate }}/g, `${moment(billInfo.GeneratedOn).format('DD-MM-YYYY')}`)
        htmlData = htmlData.replace(/{{ billPayFrom }}/g, `${moment(fromDate).format('DD-MM-YYYY')}`)
        htmlData = htmlData.replace(/{{ billPayTo }}/g, `${moment(toDate).format('DD-MM-YYYY')}`)
        htmlData = htmlData.replace(/{{ billDueDate }}/g, `${moment(billInfo.DueDate).format('DD-MM-YYYY')}`)

        // if (workOrderRoles && workOrderRoles.length > 0) {
        //     workOrderRoles.forEach((woRole, ix) => {
        //         let woRoleEmpl = (woEmployees && woEmployees.length > 0) ?
        //             woEmployees.filter(ee => {
        //                 let emWid = ee.Employee.WorkOrderRole.toString();
        //                 let Wid = woRole._id.toString();
        //                 return emWid == Wid;
        //             }) : [];
        //         let workedDays = 0;
        //         let workedDaySalary = 0;
        //         if (woRoleEmpl && woRoleEmpl.length > 0) {
        //             workedDays = +(woRoleEmpl.reduce((sum, curr) => sum + (+(curr.NoOfDaysWorked ? curr.NoOfDaysWorked : 0)), 0));
        //             workedDaySalary = +(woRoleEmpl.reduce((sum, curr) => sum + (+(curr.SalaryAfterDeduction ? curr.SalaryAfterDeduction : 0)), 0));
        //         }

        //         let rpaticulars = `<tr>
        //                                 <td style="text-align: center;">${ix + 1}</td>
        //                                 <td>${woRole?.role?.name}</td>
        //                                 <td style="text-align: center;">${woRole?.hired}</td>
        //                                 <td style="text-align: center;">${workedDays}</td>
        //                                 <td style="text-align: right;">${woRole?.salary}</td>
        //                                 <td style="text-align: right;">${workedDaySalary}</td>
        //                             </tr>`;
        //         htmlData = htmlData.replace(/{{ particularsList }}/g, `${rpaticulars}`);
        //     });
        // }

        if (billAbstract && billAbstract.length > 0) {
            const transformed = [];
            billAbstract.forEach(item => {
                const exist = transformed.find(
                    (t => t.WorkOrderRoleNameId.toString() == item.WorkOrderRoleNameId.toString() && 
                          t.WOWages.toString() == item.WOWages.toString()))
                if (exist) {
                    exist.WorkOrderRoleHired += (+(item.WorkOrderRoleHired))
                    exist.TotalNoOfManDays += (+(item.TotalNoOfManDays))
                }
                else
                    transformed.push(item)
            })
            console.log(transformed)

            let rpaticulars = "";
            transformed.forEach((billAbstractData, ix) => {
                rpaticulars = rpaticulars +
                    `<tr>
                                <td style="text-align: center;">${ix + 1}</td>
                                <td>${billAbstractData?.WorkOrderRoleName}</td>
                                <td style="text-align: right;">${billAbstractData?.WorkOrderRoleHired}</td>
                                <td style="text-align: right;">${billAbstractData?.TotalNoOfManDays}</td>
                                <td style="text-align: right;">${billAbstractData?.WOWages}</td>
                                <td style="text-align: right;">${billAbstractData?.BillAmount}</td>
                            </tr>`;
            });
            htmlData = htmlData.replace(/{{ particularsList }}/g, `${rpaticulars}`);
        }


        // if (billAbstract && billAbstract.length > 0) {
        //     let rpaticulars = "";
        //     billAbstract.forEach((billAbstractData, ix) => {
        //         if (billAbstractData?.WorkOrderRoleHired > 0) {
        //             rpaticulars = rpaticulars +
        //                 `<tr>
        //                 <td style="text-align: center;">${ix + 1}</td>
        //                 <td>${billAbstractData?.WorkOrderRoleName}</td>
        //                 <td style="text-align: right;">${billAbstractData?.WorkOrderRoleHired}</td>
        //                 <td style="text-align: right;">${billAbstractData?.TotalNoOfManDays}</td>
        //                 <td style="text-align: right;">${billAbstractData?.WOWages}</td>
        //                 <td style="text-align: right;">${billAbstractData?.BillAmount}</td>
        //             </tr>`;
        //         }

        //     });
        //     htmlData = htmlData.replace(/{{ particularsList }}/g, `${rpaticulars}`);
        // }

        htmlData = htmlData.replace(/{{ overallTotalQTY }}/g, `${billInfo.OverAllHired}`);
        // htmlData = htmlData.replace(/{{ overallnoOfManDays }}/g, `${billInfo.OverAllManDays}`);
        htmlData = htmlData.replace(/{{ overallnoOfManDays }}/g, `${billInfo.OverAllManDaysBA}`);
        // htmlData = htmlData.replace(/{{ totalAmountinRS }}/g, `${billInfo.TotalAmount}`);
        htmlData = htmlData.replace(/{{ totalAmountinRS }}/g, `${billInfo.TotalBillAmount}`);
        htmlData = htmlData.replace(/{{ totalCGST }}/g, `${billData.CGSTAmount}`);
        htmlData = htmlData.replace(/{{ totalSGST }}/g, `${billData.SGSTAmount}`);
        htmlData = htmlData.replace(/{{ overallTotalAmount }}/g, `${billData.GrossAmount}`);
        htmlData = htmlData.replace(/{{ CGST }}/g, `${billInfo.CGST}`);
        htmlData = htmlData.replace(/{{ SGST }}/g, `${billInfo.SGST}`);

        let grandTotal = Math.ceil(billData.GrossAmount);
        let amtStr = convertAmount(grandTotal);
        htmlData = htmlData.replace(/{{ overallTotalRoundFiguredAmount }}/g, `${grandTotal}`);
        htmlData = htmlData.replace(/{{ overallTotalAmountinWords }}/g, `${amtStr}`)

        // billData.InvoiceURL = `${process.env.DOCUMENT_BASE_PATH}invoiceFiles/${destinationFileName}`;

        // await BillModel.updateOne({ _id: billData._id }, { $set: billData })

        HtmlPdf
            .create(htmlData, options)
            .toFile(destinationFilePath + destinationFileName, function (err, result) {
                if (err) {
                    throw err;
                }

                // callback({success: true, data: `${process.env.DOCUMENT_BASE_PATH}invoiceFiles/${destinationFileName}`, msg:"Success!"});
                // return {success: true, data: `${process.env.DOCUMENT_BASE_PATH}invoiceFiles/${destinationFileName}`, msg:"Success!"};
            });
        return { success: true, data: `${process.env.DOCUMENT_BASE_PATH}invoiceFiles/${destinationFileName}`, msg: "Success!" };

    } catch (err) {
        console.log("error - controller ", err);
        return { success: false, data: err, msg: "Internal server error!" };
    }

}
module.exports = {
    getJoiErrorMessage,
    generateOTP,
    decrypt,
    encrypt,
    sendOtp,
    convertAmount,
    wordConvert,
    generateBillInvoice
}