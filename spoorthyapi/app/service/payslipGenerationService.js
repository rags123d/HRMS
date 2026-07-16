const path = require("path");
const HtmlPdf = require("html-pdf");
const fs = require("fs");
const archiver = require("archiver");

exports.generatePayslip = function (employeeData, attendanceData) {
  return new Promise((resolve) => {
    const sourceFilePath = path.join(
      __dirname,
      "../assets/templates/paySlip.html"
    );
    const destinationFilePath = path.join(
      __dirname,
      "../../public/uploads/payslips/"
    );
    const destinationFileName = `${employeeData.UniqueEmpId}_${
      attendanceData.Month
    }_${attendanceData.Year}_${new Date().getTime()}.pdf`;
    // const destinationFileName = `Test.pdf`;
    var htmlData = fs.readFileSync(sourceFilePath, "utf8");
    const options = {
      hieght: "1200",
    };
    htmlData = htmlData.replace(
      /{{month}}/g,
      `${attendanceData.Month}-${attendanceData.Year}`
    );
    htmlData = htmlData.replace(
      /{{employeeID}}/g,
      `${employeeData.UniqueEmpId}`
    );
    htmlData = htmlData.replace(
      /{{employeeID}}/g,
      `${employeeData.UniqueEmpId}`
    );
    htmlData = htmlData.replace(
      /{{employeeName}}/g,
      `${employeeData.FullName}`
    );
    htmlData = htmlData.replace(
      /{{designation}}/g,
      `${employeeData?.WorkOrder?.client?.designation?.name || "-"}`
    );
    htmlData = htmlData.replace(
      /{{bankAccountNo}}/g,
      `${employeeData.AccountNumber || ""}`
    );
    htmlData = htmlData.replace(/{{ifscCode}}/g, `${employeeData.IFSC || ""}`);
    htmlData = htmlData.replace(/{{site}}/g, `${employeeData.FullName || ""}`);
    htmlData = htmlData.replace(
      /{{payableDays}}/g,
      `${attendanceData.NoOfWorkingDays || ""}`
    );
    htmlData = htmlData.replace(
      /{{presentDays}}/g,
      `${attendanceData.NoOfDaysWorked || ""}`
    );
    htmlData = htmlData.replace(
      /{{otDays}}/g,
      `${attendanceData.NoOfOTDays || ""}`
    );
    htmlData = htmlData.replace(
      /{{uanNo}}/g,
      `${employeeData.UniversalAccount || ""}`
    );
    htmlData = htmlData.replace(/{{esiNo}}/g, `${employeeData.ESI || ""}`);
    htmlData = htmlData.replace(
      /{{aadharNo}}/g,
      `${employeeData.AadharNo || ""}`
    );
    htmlData = htmlData.replace(
      /{{fixedBasic}}/g,
      `${employeeData.BasicVDA || ""}`
    );
    htmlData = htmlData.replace(
      /{{earnedBasic}}/g,
      `${attendanceData.EWBasiVDA || ""}`
    );
    htmlData = htmlData.replace(
      /{{pfAmount}}/g,
      `${employeeData.PFAmount || ""}`
    );
    htmlData = htmlData.replace(/{{fixedHRA}}/g, `${employeeData.HRA || ""}`);
    htmlData = htmlData.replace(
      /{{earnedHRA}}/g,
      `${attendanceData.EWHRA || ""}`
    );
    htmlData = htmlData.replace(
      /{{esiAmount}}/g,
      `${employeeData.ESIAmount || "0"}`
    );
    htmlData = htmlData.replace(
      /{{fixedConveyance}}/g,
      `${employeeData.Conveyance || "0"}`
    );
    htmlData = htmlData.replace(
      /{{fixedMedicalAllowance}}/g,
      `${employeeData.MedicalAllowance || "0"}`
    );
    htmlData = htmlData.replace(
      /{{fixedSpecialAllowance}}/g,
      `${employeeData.SpecialAllowance || "0"}`
    );
    htmlData = htmlData.replace(
      /{{fixedBonusAmount}}/g,
      `${employeeData.Bonus || "0"}`
    );
    htmlData = htmlData.replace(
      /{{fixedLeaveWages}}/g,
      `${employeeData.LeaveWithWages || "0"}`
    );
    htmlData = htmlData.replace(
      /{{fixedWashingAllowance}}/g,
      `${employeeData.WashingAllowance || "0"}`
    );
    htmlData = htmlData.replace(
      /{{earnedConveyance}}/g,
      `${attendanceData.EWConveyance || "0"}`
    );
    htmlData = htmlData.replace(
      /{{professionalTax}}/g,
      `${employeeData.ProfessionalTax || "0"}`
    );
    htmlData = htmlData.replace(
      /{{earnedMedicalAllowance}}/g,
      `${attendanceData.EWMedicalAllowance || "0"}`
    );
    htmlData = htmlData.replace(
      /{{tdsAmount}}/g,
      `${attendanceData.TDSAmount || "0"}`
    );
    htmlData = htmlData.replace(
      /{{earnedSpecialAllowance}}/g,
      `${attendanceData.EWSpecialAllowance || ""}`
    );
    htmlData = htmlData.replace(
      /{{advanceAmount}}/g,
      `${attendanceData.AdvanceAmount || ""}`
    );
    htmlData = htmlData.replace(
      /{{earnedBonusAmount}}/g,
      `${attendanceData.EWBonus || ""}`
    );
    htmlData = htmlData.replace(
      /{{uniformAmount}}/g,
      `${attendanceData.UniformFee || ""}`
    );
    htmlData = htmlData.replace(
      /{{earnedLeaveWages}}/g,
      `${attendanceData.EWLeaveWages || "0"}`
    );
    htmlData = htmlData.replace(
      /{{fineAmount}}/g,
      `${attendanceData.FineAmount || ""}`
    );
    htmlData = htmlData.replace(
      /{{earnedWashingAllowance}}/g,
      `${attendanceData.EWWashingAllowance || ""}`
    );
    htmlData = htmlData.replace(
      /{{deductionAmount}}/g,
      `${attendanceData.OtherDeductionAmount || ""}`
    );
    htmlData = htmlData.replace(
      /{{otWages}}/g,
      `${attendanceData.OTWages || ""}`
    );
    htmlData = htmlData.replace(
      /{{fixedFestiveAllowance}}/g,
      `${employeeData.NationalFestivalHolidays || ""}`
    );
    htmlData = htmlData.replace(
      /{{earnedFestiveAllowance}}/g,
      `${attendanceData.EWNationalFestivalHolidays || ""}`
    );
    htmlData = htmlData.replace(
      /{{fixedTotal}}/g,
      `${
        attendanceData.TotalFixedWages
          ? parseFloat(attendanceData.TotalFixedWages).toFixed(2)
          : 0
      }`
    );
    htmlData = htmlData.replace(
      /{{earnedTotal}}/g,
      `${
        attendanceData.TotalEarnedWages
          ? parseFloat(attendanceData.TotalEarnedWages).toFixed(2)
          : 0
      }`
    );
    htmlData = htmlData.replace(
      /{{deductionTotal}}/g,
      `${
        attendanceData.Deduction
          ? parseFloat(attendanceData.Deduction).toFixed(2)
          : 0
      }`
    );
    htmlData = htmlData.replace(
      /{{netAmount}}/g,
      `${
        attendanceData.TotalNetPayable
          ? parseFloat(attendanceData.TotalNetPayable).toFixed(2)
          : 0
      }`
    );

    HtmlPdf.create(htmlData, options).toFile(
      destinationFilePath + destinationFileName,
      function (err, result) {
        if (err) {
          throw err;
        }
        resolve({
          path: destinationFilePath + destinationFileName,
          fileName: destinationFileName,
        });
        //   callback("uploads/invoiceFiles/" + destinationFileName);
      }
    );
  });
};

exports.createZipArchive = function (files) {
  return new Promise(async (resolve) => {
    const destinationFilePath = path.join(
      __dirname,
      "../../public/uploads/payslips/"
    );
    //   const destinationFileName = `${employeeData.UniqueEmpId}_${
    //     attendanceData.Month
    //   }_${attendanceData.Year}_${new Date().getTime()}.pdf`;
    const destinationFileName = `${new Date().getTime()}.zip`;
    var output = fs.createWriteStream(
      `${destinationFilePath}${destinationFileName}`
    );
    var archive = archiver("zip", {
      gzip: true,
      zlib: { level: 9 }, // Sets the compression level.
    });

    archive.on("error", function (err) {
      throw err;
    });

    // pipe archive data to the output file
    archive.pipe(output);

    for (let file of files) {
      archive.file(file.path, {
        name: file.fileName,
      });
    }

    // wait for streams to complete
    await archive.finalize();
    resolve("uploads/payslips/" + destinationFileName);
  });
};
