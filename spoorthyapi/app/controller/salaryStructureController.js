const SalaryStructureModel = require('../model/salaryStructure');
const SalaryStructureValidations = require('../validations/salaryStructureValidations');

exports.getSalaryStructure = async function (req, res) {
    SalaryStructureModel
    .find({})
    .sort({ name: 1 })
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

exports.addSalaryStructure = async function (req, res) {
    if (!req.body.name) {
        return res
        .status(400)
        .send({ success: false, message: "name is required" })
    }
    else{
        var count = await SalaryStructureModel.findOne({ name: req.body.name }).countDocuments();
        if(count){
            return res
                .status(500)
                .send({ success: false, message: 'SalaryStructure details already present with this name' });
        }
        var SalaryStructureData = new SalaryStructureModel({
            name: req.body.name
        });
        SalaryStructureData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            return res
                .status(200)
                .send({ success: true, message: 'SalaryStructure details added successfully', data: result });
        })
    }
}

exports.editSalaryStructure = async function (req, res) {
    const { error, value } = SalaryStructureValidations
        .validate(SalaryStructureValidations.ValidationTypes.SalaryStructure_EDIT, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await SalaryStructureModel
            .updateOne({ _id: value.id }, { $set: { name: value.name } })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Salary Structure name Updated successfully' })
            })
    }
}

exports.deleteSalaryStructure = async function (req, res) {
    const { error, value } = SalaryStructureValidations
        .validate(SalaryStructureValidations.ValidationTypes.SalaryStructure_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await SalaryStructureModel
            .deleteOne({ _id: value.id })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Salary Structure name deleted successfully' })
            })
    }
}
