const EmployeeModel = require('../model/employee');
const EmployeeLogsValidations = require('../validations/employeeLogsValidation');
const EmployeeLogsModel = require('../model/employeeLogs');
const GeneralUtils = require('../utils/generalUtils');

exports.getEmployeeLogs = async function (req, res) {
    const { error, value } = EmployeeLogsValidations
        .validate(EmployeeLogsValidations.ValidationTypes.EMPLOYEE_LOG_SCHEMA, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        EmployeeLogsModel
            .find({ isDeleted: false })
            .populate('Gender')
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
