const AttendanceModel = require('../model/attendance')
const AttendanceValidations = require('../validations/attendanceValidations')
const GeneralUtils = require('../utils/generalUtils')

exports.getAttendanceByDate = async function (req, res) {
    const { error, value } = AttendanceValidations
        .validate(AttendanceValidations.ValidationTypes.ATTENDANCE, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    await AttendanceModel
        .findOne({ Employee: value.id, Month: value.Month, Year: value.Year })
        .exec(async (err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }

            return res
                .status(200)
                .send({ success: true, data: result })
        })
}