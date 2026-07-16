const ClientModel = require('../model/client');
const GeneralUtils = require('../utils/generalUtils');
const ClientValidations = require('../validations/clientValidations');
const DesignationModel = require('../model/designation');
const WorkOrderModel = require('../model/workOrder');
const EmployeeModel = require('../model/employee');
var fs = require('fs');

exports.getClient = async function (req, res) {
    ClientModel
        .find({ isDeleted: false })
        .sort({ name: 1 })
        .populate('designation')
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

exports.getPostClient = async function (req, res) {
    ClientModel
        .find({ isDeleted: false })
        .sort({ name: 1 })
        .populate('designation')
        .exec((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: true, message: 'Internal server error' })
            }
            // return res
            //     .status(200)
            //     .send({ success: true, data: result })

            let searchText = req.body.searchText;
            if (searchText && searchText.length > 1) {
                searchText = searchText.toString().toLowerCase();
                result = result.filter(item => {
                    return (item.name && item.name.toLowerCase().indexOf(searchText) !== -1) || !searchText;
                });
            }

            let resdata = (result && result.length > 0) ? result.slice((req.body.skip ? req.body.skip : 0), (req.body.skip ? req.body.skip : 0) + (req.body.limit ? req.body.limit : 10)) : [];
            return res
                .status(200)
                .send({
                    success: true,
                    data: {
                        result: resdata,
                        total: (result && result.length > 0) ? result.length : 0
                    }
                });
        })
}

exports.getClientById = async function (req, res) {
    const { error, value } = ClientValidations
        .validate(ClientValidations.ValidationTypes.CLIENT_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    ClientModel
        .findOne({ _id: value.id })
        .populate('designation')
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

exports.addEditClient = async function (req, res) {
    const { error, value } = ClientValidations
        .validate(ClientValidations.ValidationTypes.CLIENT_REGISTER, req.body);

    if (error) {
        if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
        // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
        if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
        if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
        if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
        if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    // else if (!req.files.companyLogo) {
    //     // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
    //     if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
    //     if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
    //     if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
    //     if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
    //     return res
    //         .status(400)
    //         .send({ success: false, message: 'companyLogo is required' })
    // }
    // else if (!req.files.agreementDocument) {
    //     if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
    //     if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
    //     if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
    //     if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
    //     if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
    //     return res
    //         .status(400)
    //         .send({ success: false, message: 'agreementDocument is required' });
    // }
    // else if (!req.files.licenseDocument) {
    //     if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
    //     // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
    //     if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
    //     if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
    //     if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
    //     return res
    //         .status(400)
    //         .send({ success: false, message: 'licenseDocument is required' });
    // }
    // else if (!req.files.GSTDocument) {
    //     if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
    //     // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
    //     if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
    //     if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
    //     if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
    //     return res
    //         .status(400)
    //         .send({ success: false, message: 'GSTDocument is required' });
    // }
    // else if (!req.files.PANDocument) {
    //     if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
    //     // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
    //     if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
    //     if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
    //     if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
    //     return res
    //         .status(400)
    //         .send({ success: false, message: 'PANDocument is required' });
    // }
    // else if (!req.files.TANDocument) {
    //     if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
    //     // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
    //     if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
    //     if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
    //     if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
    //     return res
    //         .status(400)
    //         .send({ success: false, message: 'TANDocument is required' });
    // }
    else {
        var ClientModelData = {
            name: value.name,
            address: value.address,
            officePhoneNo: value.officePhoneNo,
            contactPerson: value.contactPerson,
            designation: value.designation,
            cantactNo: value.cantactNo,
            email: value.email,
            GSTIN: value.GSTIN,
            PAN: value.PAN,
            TAN: value.TAN,
            pinCode: value.pinCode,
            contactEmail: value.contactEmail
        };
        if (value.id) {
            await ClientModel
                .findOne({ _id: value.id })
                .exec(async (err, result) => {
                    if (err) {
                        if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
                        // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                        if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
                        if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
                        if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
                        if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
                        return res
                            .status(500)
                            .send({ success: false, message: 'Internal server error' })
                    }
                    var descount = await DesignationModel.findOne({ _id: value.designation }).countDocuments();
                    if (descount == 0) {
                        if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
                        // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                        if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
                        if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
                        if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
                        if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
                        return res
                            .status(500)
                            .send({ success: false, message: 'designation not valid!' });
                    }
                    var count = await ClientModel.findOne({ _id: { $ne: value.id }, name: value.name }).countDocuments();
                    if (count) {
                        if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
                        // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                        if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
                        if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
                        if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
                        if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
                        return res
                            .status(500)
                            .send({ success: false, message: 'Client already present with this name' });
                    }

                    var OldcompanyLogo = result.companyLogo;
                    // var OldagreementDocument = result.agreementDocument;
                    var OldlicenseDocument = result.licenseDocument;
                    var OldGSTDocument = result.GSTDocument;
                    var OldPANDocument = result.PANDocument;
                    var OldTANDocument = result.TANDocument;

                    if (req.files.companyLogo
                        && req.files.companyLogo.length
                        && req.files.companyLogo[0]) {
                        if (OldcompanyLogo) { fs.unlinkSync('./public/' + OldcompanyLogo) }
                        ClientModelData['companyLogo'] = 'uploads/clients/' + result._id + "/" + req.files.companyLogo[0].filename;
                        move('./public/uploads/clients/' + req.files.companyLogo[0].filename, './public/uploads/clients/' + result._id + "/" + req.files.companyLogo[0].filename);
                    }

                    // if (req.files.agreementDocument
                    //     && req.files.agreementDocument.length
                    //     && req.files.agreementDocument[0]) {
                    //     if (OldagreementDocument) { fs.unlinkSync('./public/' + OldagreementDocument) }
                    //     ClientModelData['agreementDocument'] = 'uploads/clients/' + result._id + "/" + req.files.agreementDocument[0].filename;
                    //     move('./public/uploads/clients/' + req.files.agreementDocument[0].filename, './public/uploads/clients/' + result._id + "/" + req.files.agreementDocument[0].filename);
                    // }

                    if (req.files.licenseDocument
                        && req.files.licenseDocument.length
                        && req.files.licenseDocument[0]) {
                        if (OldlicenseDocument) { fs.unlinkSync('./public/' + OldlicenseDocument) }
                        ClientModelData['licenseDocument'] = 'uploads/clients/' + result._id + "/" + req.files.licenseDocument[0].filename;
                        move('./public/uploads/clients/' + req.files.licenseDocument[0].filename, './public/uploads/clients/' + result._id + "/" + req.files.licenseDocument[0].filename);
                    }

                    if (req.files.GSTDocument
                        && req.files.GSTDocument.length
                        && req.files.GSTDocument[0]) {
                        if (OldGSTDocument) { fs.unlinkSync('./public/' + OldGSTDocument) }
                        ClientModelData['GSTDocument'] = 'uploads/clients/' + result._id + "/" + req.files.GSTDocument[0].filename;
                        move('./public/uploads/clients/' + req.files.GSTDocument[0].filename, './public/uploads/clients/' + result._id + "/" + req.files.GSTDocument[0].filename);
                    }

                    if (req.files.PANDocument
                        && req.files.PANDocument.length
                        && req.files.PANDocument[0]) {
                        if (OldPANDocument) { fs.unlinkSync('./public/' + OldPANDocument) }
                        ClientModelData['PANDocument'] = 'uploads/clients/' + result._id + "/" + req.files.PANDocument[0].filename;
                        move('./public/uploads/clients/' + req.files.PANDocument[0].filename, './public/uploads/clients/' + result._id + "/" + req.files.PANDocument[0].filename);
                    }

                    if (req.files.TANDocument
                        && req.files.TANDocument.length
                        && req.files.TANDocument[0]) {
                        if (OldTANDocument) { fs.unlinkSync('./public/' + OldTANDocument) }
                        ClientModelData['TANDocument'] = 'uploads/clients/' + result._id + "/" + req.files.TANDocument[0].filename;
                        move('./public/uploads/clients/' + req.files.TANDocument[0].filename, './public/uploads/clients/' + result._id + "/" + req.files.TANDocument[0].filename);
                    }

                    await ClientModel
                        .updateOne({ _id: value.id }, { $set: ClientModelData })
                        .exec((err, result) => {
                            if (err) {
                                if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
                                // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                                if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
                                if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
                                if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
                                if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
                                return res
                                    .status(500)
                                    .send({ success: false, message: 'Internal server error' })
                            }
                            return res
                                .status(200)
                                .send({ success: true, message: 'Client details updated successfully' })
                        })
                })
        }
        else {
            var descount = await DesignationModel.findOne({ _id: value.designation }).countDocuments();
            if (descount == 0) {
                if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
                // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
                if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
                if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
                if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
                return res
                    .status(500)
                    .send({ success: false, message: 'designation not valid!' });
            }
            var count = await ClientModel.findOne({ name: value.name }).countDocuments();
            if (count) {
                if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
                // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
                if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
                if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
                if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
                return res
                    .status(500)
                    .send({ success: false, message: 'Client already present with this name' });
            }
            var ClientData = new ClientModel(ClientModelData);
            ClientData.save(async (err, result) => {
                if (err) {
                    if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
                    // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                    if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
                    if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
                    if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
                    if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' });
                }

                if (!fs.existsSync('./public/uploads/clients/' + ClientData._id)) {
                    fs.mkdirSync('./public/uploads/clients/' + ClientData._id, { recursive: true });
                }

                if (req.files.companyLogo
                    && req.files.companyLogo.length
                    && req.files.companyLogo[0]) {
                    ClientData['companyLogo'] = 'uploads/clients/' + ClientData._id + "/" + req.files.companyLogo[0].filename;
                }

                // if (req.files.agreementDocument
                //     && req.files.agreementDocument.length
                //     && req.files.agreementDocument[0]) {
                //     ClientData['agreementDocument'] = 'uploads/clients/' + ClientData._id + "/" + req.files.agreementDocument[0].filename;
                // }

                if (req.files.licenseDocument
                    && req.files.licenseDocument.length
                    && req.files.licenseDocument[0]) {
                    ClientData['licenseDocument'] = 'uploads/clients/' + ClientData._id + "/" + req.files.licenseDocument[0].filename;
                }

                if (req.files.GSTDocument
                    && req.files.GSTDocument.length
                    && req.files.GSTDocument[0]) {
                    ClientData['GSTDocument'] = 'uploads/clients/' + ClientData._id + "/" + req.files.GSTDocument[0].filename;
                }

                if (req.files.PANDocument
                    && req.files.PANDocument.length
                    && req.files.PANDocument[0]) {
                    ClientData['PANDocument'] = 'uploads/clients/' + ClientData._id + "/" + req.files.PANDocument[0].filename;
                }

                if (req.files.TANDocument
                    && req.files.TANDocument.length
                    && req.files.TANDocument[0]) {
                    ClientData['TANDocument'] = 'uploads/clients/' + ClientData._id + "/" + req.files.TANDocument[0].filename;
                }

                await ClientModel
                    .updateOne({ _id: ClientData._id }, { $set: ClientData })
                    .exec((err, result1) => {
                        if (err) {
                            if (req.files.companyLogo) { fs.unlinkSync('./public/uploads/clients/' + req.files.companyLogo[0].filename) }
                            // if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                            if (req.files.licenseDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.licenseDocument[0].filename) }
                            if (req.files.GSTDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.GSTDocument[0].filename) }
                            if (req.files.PANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.PANDocument[0].filename) }
                            if (req.files.TANDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.TANDocument[0].filename) }
                            return res
                                .status(500)
                                .send({ success: false, message: 'Internal server error' })
                        }

                        if (req.files.companyLogo
                            && req.files.companyLogo.length
                            && req.files.companyLogo[0]) {
                            move('./public/uploads/clients/' + req.files.companyLogo[0].filename, './public/uploads/clients/' + ClientData._id + "/" + req.files.companyLogo[0].filename);
                        }

                        // if (req.files.agreementDocument
                        //     && req.files.agreementDocument.length
                        //     && req.files.agreementDocument[0]) {
                        //     move('./public/uploads/clients/' + req.files.agreementDocument[0].filename, './public/uploads/clients/' + ClientData._id + "/" + req.files.agreementDocument[0].filename);
                        // }

                        if (req.files.licenseDocument
                            && req.files.licenseDocument.length
                            && req.files.licenseDocument[0]) {
                            move('./public/uploads/clients/' + req.files.licenseDocument[0].filename, './public/uploads/clients/' + ClientData._id + "/" + req.files.licenseDocument[0].filename);
                        }

                        if (req.files.GSTDocument
                            && req.files.GSTDocument.length
                            && req.files.GSTDocument[0]) {
                            move('./public/uploads/clients/' + req.files.GSTDocument[0].filename, './public/uploads/clients/' + ClientData._id + "/" + req.files.GSTDocument[0].filename);
                        }

                        if (req.files.PANDocument
                            && req.files.PANDocument.length
                            && req.files.PANDocument[0]) {
                            move('./public/uploads/clients/' + req.files.PANDocument[0].filename, './public/uploads/clients/' + ClientData._id + "/" + req.files.PANDocument[0].filename);
                        }

                        if (req.files.TANDocument
                            && req.files.TANDocument.length
                            && req.files.TANDocument[0]) {
                            move('./public/uploads/clients/' + req.files.TANDocument[0].filename, './public/uploads/clients/' + ClientData._id + "/" + req.files.TANDocument[0].filename);
                        }

                        return res
                            .status(200)
                            .send({ success: true, message: 'Client details added successfully', data: result })
                    })
            })
        }
    }

}

exports.deleteClient = async function (req, res) {
    const { error, value } = ClientValidations
        .validate(ClientValidations.ValidationTypes.CLIENT_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        const count = await ClientModel.findOne({ _id: value.id }).countDocuments();
        if (!count) {
            return res
                .status(500)
                .send({ success: false, message: 'Client id not found!' })
        }

        await ClientModel
            .updateOne({ _id: value.id }, { $set: { isDeleted: true } })
            .exec(async (err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                await WorkOrderModel
                    .updateMany({ client: value.id }, { $set: { isDeleted: true } })
                    .exec(async (err, WorkOrderresult) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ success: false, message: 'Internal server error' })
                        }
                        if (WorkOrderresult) {
                            workorderids = [];
                            for (let index = 0; index < WorkOrderresult.length; index++) {
                                const element = WorkOrderresult[index];
                                if (element) {
                                    workorderids.push(element._id);
                                }
                            }
                            await EmployeeModel
                                .updateMany({ WorkOrder: workorderids }, { $set: { isDeleted: true } })
                                .exec((err, result) => {
                                    if (err) {
                                        return res
                                            .status(500)
                                            .send({ success: false, message: 'Internal server error' })
                                    }

                                    var path = "./public/uploads/clients/" + value.id
                                    if (fs.existsSync(path)) {
                                        fs.readdirSync(path).forEach(function (file) {
                                            var curPath = path + "/" + file;
                                            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                                                deleteFolderRecursive(curPath);
                                            } else { // delete file
                                                fs.unlinkSync(curPath);
                                            }
                                        });
                                        fs.rmdirSync(path);
                                    }

                                    return res
                                        .status(200)
                                        .send({ success: true, message: 'Client deleted successfully' })
                                })
                        }
                    })
            })
    }
}

function move(oldPath, newPath) {
    var source = fs.createReadStream(oldPath);
    var dest = fs.createWriteStream(newPath);

    source.pipe(dest);
    source.on('end', function () { /* copied */
        console.log('Successfully renamed - AKA moved!');
        fs.unlinkSync(oldPath);
    });
    source.on('error', function (err) { /* error */
        console.log("copy err", err);
    });
}