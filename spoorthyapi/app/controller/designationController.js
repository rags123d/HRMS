const DesignationModel = require('../model/designation');
const DesignationValidations = require('../validations/designationValidations');
const XLSX = require('xlsx');

exports.getDesignation = async function (req, res) {
    DesignationModel
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

exports.addDesignation = async function (req, res) {
    if (!req.body.name) {
        return res
            .status(400)
            .send({ success: false, message: "name is required" })
    }
    else {
        var count = await DesignationModel.findOne({ name: req.body.name }).countDocuments();
        if (count) {
            return res
                .status(500)
                .send({ success: false, message: 'Designation already present with this name' });
        }
        var DesignationData = new DesignationModel({
            name: req.body.name
        });
        DesignationData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            return res
                .status(200)
                .send({ success: true, message: 'Designation details added successfully', data: result });
        })
    }
}

exports.editDesignation = async function (req, res) {
    const { error, value } = DesignationValidations
        .validate(DesignationValidations.ValidationTypes.DESIGNATION_EDIT, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await DesignationModel
            .updateOne({ _id: value.id }, { $set: { name: value.name } })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Designation deleted successfully' })
            })
    }
}

exports.deleteDesignation = async function (req, res) {
    const { error, value } = DesignationValidations
        .validate(DesignationValidations.ValidationTypes.DESIGNATION_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await DesignationModel
            .deleteOne({ _id: value.id })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Designation deleted successfully' })
            })
    }
}

exports.bulkUploadDesignation = async function (req, res) {
    try {
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: 'Excel file is required'
            });
        }

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName],
            { defval: '' }
        );

        if (!sheetData.length) {
            return res.status(400).send({
                success: false,
                message: 'Excel file is empty'
            });
        }

        const namesFromExcel = sheetData
            .map(row => (row.name || row.Designation || '').trim())
            .filter(Boolean);

        if (!namesFromExcel.length) {
            return res.status(400).send({
                success: false,
                message: 'No valid designation names found'
            });
        }

        const existingDesignations = await DesignationModel.find({
            name: { $in: namesFromExcel }
        }).select('name');

        const existingNames = existingDesignations.map(d => d.name);

        const newDesignations = namesFromExcel
            .filter(name => !existingNames.includes(name))
            .map(name => ({ name }));

        if (!newDesignations.length) {
            return res.status(200).send({
                success: true,
                message: 'All designations already exist',
                insertedCount: 0,
                skippedCount: namesFromExcel.length
            });
        }

        const result = await DesignationModel.insertMany(newDesignations);

        return res.status(200).send({
            success: true,
            message: 'Designation bulk upload completed',
            insertedCount: result.length,
            skippedCount: existingNames.length
        });

    } catch (error) {
        console.error('Bulk upload error:', error);
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
};
