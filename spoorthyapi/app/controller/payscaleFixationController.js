const PayscaleFixModel = require('../model/payscaleFixation');
const PayscaleFixValidations = require('../validations/PayscaleFixValidations');
const GeneralUtils = require('../utils/generalUtils');

exports.getPayscaleFixation = async function (req, res) {
    PayscaleFixModel
        .find({ isDeleted: false })
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

exports.addPayscaleFixation = async function (req, res) {
    const { error, value } = PayscaleFixValidations
        .validate(PayscaleFixValidations.ValidationTypes.PAYSCALEFIX_UPDATE, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        var PayscaleFixationData = new PayscaleFixModel({
            WorkOrder: value.WorkOrder,
            WorkOrderRole: value.WorkOrderRole,
            ESIBasedOn: value.ESIBasedOn,

            GrossSalary: value.GrossSalary,
            NetSalary: value.NetSalary,
            DeductedSalary: value.DeductedSalary,

            benefitType: value.benefitType,
            BasicVDA: value.BasicVDA,
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
        });

        PayscaleFixationData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            return res
                .status(200)
                .send({ success: true, message: 'Payscale Fixation details added successfully', data: result });
        })
    }
}

exports.editPayscaleFixation = async function (req, res) {
    const { error, value } = PayscaleFixValidations
        .validate(PayscaleFixValidations.ValidationTypes.PAYSCALEFIX_EDIT, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        var PayscaleFixationData = ({
            WorkOrder: value.WorkOrder,
            WorkOrderRole: value.WorkOrderRole,
            ESIBasedOn: value.ESIBasedOn,

            benefitType: value.benefitType,
            BasicVDA: value.BasicVDA,
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
        });

        await PayscaleFixModel
            .updateOne({ _id: value.id }, { $set: { name: PayscaleFixationData } })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Payscale Fixation Modfified Successfully' })
            })
    }
}

exports.deletePayscaleFixation = async function (req, res) {
    const { error, value } = PayscaleFixValidations
        .validate(PayscaleFixValidations.ValidationTypes.PAYSCALEFIX_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await PayscaleFixModel
            .deleteOne({ _id: value.id })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Payscale Fixation deleted successfully' })
            })
    }
}
