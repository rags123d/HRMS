const ReligionModel = require('../model/religion');
const ReligionValidations = require('../validations/religionValidations');

exports.getReligion = async function (req, res) {
    ReligionModel
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

exports.addReligion = async function (req, res) {
    if (!req.body.name) {
        return res
        .status(400)
        .send({ success: false, message: "name is required" })
    }
    else{
        var count = await ReligionModel.findOne({ name: req.body.name }).countDocuments();
        if(count){
            return res
                .status(500)
                .send({ success: false, message: 'Religion already present with this name' });
        }
        var ReligionData = new ReligionModel({
            name: req.body.name
        });
        ReligionData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            return res
                .status(200)
                .send({ success: true, message: 'Religion details added successfully', data: result });
        })
    }
}

exports.editReligion = async function (req, res) {
    const { error, value } = ReligionValidations
        .validate(ReligionValidations.ValidationTypes.RELIGION_EDIT, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await ReligionModel
            .updateOne({ _id: value.id }, { $set: { name: value.name } })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Religion deleted successfully' })
            })
    }
}

exports.deleteReligion = async function (req, res) {
    const { error, value } = ReligionValidations
        .validate(ReligionValidations.ValidationTypes.RELIGION_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await ReligionModel
            .deleteOne({ _id: value.id })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Religion deleted successfully' })
            })
    }
}
