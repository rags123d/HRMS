const LanguageModel = require('../model/language');
const LanguageValidations = require('../validations/languageValidations');

exports.getLanguage = async function (req, res) {
    LanguageModel
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

exports.addLanguage = async function (req, res) {
    if (!req.body.name) {
        return res
            .status(400)
            .send({ success: false, message: "name is required" })
    }
    else {
        var count = await LanguageModel.findOne({ name: req.body.name }).countDocuments();
        if (count) {
            return res
                .status(500)
                .send({ success: false, message: 'Language already present with this name' });
        }
        var LanguageData = new LanguageModel({
            name: req.body.name
        });
        LanguageData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            return res
                .status(200)
                .send({ success: true, message: 'Language details added successfully', data: result });
        })
    }
}

exports.editLanguage = async function (req, res) {
    const { error, value } = LanguageValidations
        .validate(LanguageValidations.ValidationTypes.LANGUAGE_EDIT, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await LanguageModel
            .updateOne({ _id: value.id }, { $set: { name: value.name } })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Language deleted successfully' })
            })
    }
}

exports.deleteLanguage = async function (req, res) {
    const { error, value } = LanguageValidations
        .validate(LanguageValidations.ValidationTypes.LANGUAGE_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await LanguageModel
            .deleteOne({ _id: value.id })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Language deleted successfully' })
            })
    }
}
