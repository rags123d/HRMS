const YearModel = require('../model/year');
const YearValidations = require('../validations/yearValidations');

exports.getYear = async function (req, res) {
    YearModel
        .find({})
        .sort({ Year: 1 })
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

exports.addYear = async function (req, res) {
    if (!req.body.Year) {
        return res
            .status(400)
            .send({ success: false, message: "name is required" })
    }
    else {
        var count = await YearModel.findOne({ Year: req.body.Year }).countDocuments();
        if (count) {
            return res
                .status(500)
                .send({ success: false, message: 'Year already present' });
        }
        var YearData = new YearModel({
            Year: req.body.Year
        });
        YearData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            return res
                .status(200)
                .send({ success: true, message: 'Year details added successfully', data: result });
        })
    }
}

exports.editYear = async function (req, res) {
    const { error, value } = YearValidations
        .validate(YearValidations.ValidationTypes.YEAR_EDIT, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await YearModel
            .updateOne({ _id: value.id }, { $set: { name: value.name } })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Year deleted successfully' })
            })
    }
}

exports.deleteYear = async function (req, res) {
    const { error, value } = YearValidations
        .validate(YearValidations.ValidationTypes.YEAR_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await YearModel
            .deleteOne({ _id: value.id })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Year deleted successfully' })
            })
    }
}
