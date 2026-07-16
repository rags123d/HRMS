const WorkOrderModel = require('../model/workOrder');
const GeneralUtils = require('../utils/generalUtils');
const WorkOrderValidations = require('../validations/workOrderValidations');
const EmployeeModel = require('../model/employee');
const WorkOrderRolesModel = require('../model/workOrderRole');
const ClientModel = require('../model/client');
var fs = require('fs');


exports.getWorkOrder = async function (req, res) {
    WorkOrderModel
        .find({ isDeleted: false })
        .populate('client')
        .populate({
            path: 'workOrderRoles',
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
            var sortedData = result.sort((a, b) => a.client.name.localeCompare(b.client.name))
            return res
                .status(200)
                .send({ success: true, data: sortedData })
        })
}

exports.getWorkOrderById = async function (req, res) {
    const { error, value } = WorkOrderValidations
        .validate(WorkOrderValidations.ValidationTypes.WORKORDER_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    WorkOrderModel
        .findOne({ _id: req.body.id })
        .populate('client')
        .populate({
            path: 'workOrderRoles',
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

            // let resdata = (result && result.length > 0) ? result.slice((value.skip ? value.skip : 0), (value.skip ? value.skip : 0) + (value.limit ? value.limit : 10)) : [];
            // return res
            //     .status(200)
            //     .send({
            //         success: true,
            //         data: {
            //             result: resdata,
            //             total: (result && result.length > 0) ? result.length : 0
            //         }
            //     });
        })
}

exports.getWorkOrderNotHired = async function (req, res) {
    await WorkOrderModel
        .find({ isDeleted: false })
        .exec(async (err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: true, message: 'Internal server error' })
            }
            await WorkOrderModel
                .find({ hired: { $ne: result.noOfRequirements } })
                .populate('client')
                .exec((err, data) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ success: true, message: 'Internal server error' })
                    }
                    return res
                        .status(200)
                        .send({ success: true, data: data })
                })
        })
}

exports.getPostWorkOrderNotHired = async function (req, res) {
    await WorkOrderModel
        .find({ isDeleted: false })
        .exec(async (err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: true, message: 'Internal server error' })
            }
            await WorkOrderModel
                .find({ hired: { $ne: result.noOfRequirements } })
                .populate('client')
                .exec((err, data) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ success: true, message: 'Internal server error' })
                    }
                    // return res
                    //     .status(200)
                    //     .send({ success: true, data: data })

                    let resdata = (data && data.length > 0) ? data.slice((req.body.skip ? req.body.skip : 0), (req.body.skip ? req.body.skip : 0) + (req.body.limit ? req.body.limit : 10)) : [];
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
        })
}

exports.getWorkOrderByClient = async function (req, res) {
    const { error, value } = WorkOrderValidations
        .validate(WorkOrderValidations.ValidationTypes.CLIENT_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        WorkOrderModel
            .find({ isDeleted: false, client: value.id, workOrderType: { $ne: "SUB_WORKORDER" } })
            .populate('client')
            .populate('workOrderRoles')
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: true, message: 'Internal server error' })
                }
                // return res
                //     .status(200)
                //     .send({ success: true, data: result })

                let resdata = (result && result.length > 0) ? result.slice((value.skip ? value.skip : 0), (value.skip ? value.skip : 0) + (value.limit ? value.limit : 10)) : [];
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
}

exports.getSubWorkOrderByClient = async function (req, res) {
    const { error, value } = WorkOrderValidations
        .validate(WorkOrderValidations.ValidationTypes.CLIENT_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        WorkOrderModel
            .find({ isDeleted: false, mainWorkOrderId: value.id, workOrderType: "SUB_WORKORDER" })
            .populate('client')
            .populate('workOrderRoles')
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: true, message: 'Internal server error' })
                }
                // return res
                //     .status(200)
                //     .send({ success: true, data: result })


                let searchText = value.searchText;
                if (searchText && searchText.length > 1) {
                    searchText = searchText.toString().toLowerCase();
                    result = result.filter(item => {
                        return (item.FullName && item.FullName.toLowerCase().indexOf(searchText) !== -1) ||
                            (item.PresentAddressPhone && item.PresentAddressPhone.toLowerCase().indexOf(searchText) !== -1) ||
                            (item.PermanentAddressPhone && item.PermanentAddressPhone.toLowerCase().indexOf(searchText) !== -1) || !searchText;
                    });
                }

                let resdata = (result && result.length > 0) ? result.slice((value.skip ? value.skip : 0), (value.skip ? value.skip : 0) + (value.limit ? value.limit : 10)) : [];
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
}

exports.addEditWorkOrder = async function (req, res) {
    const { error, value } = WorkOrderValidations
        .validate(WorkOrderValidations.ValidationTypes.WORKORDER_REGISTER, req.body);

    if (error) {
        if (req.files.workOrderDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.workOrderDocument[0].filename) }
        if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
        if (req.files.bankGuaranteeDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.bankGuaranteeDocument[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else if (!req.files.workOrderDocument) {
        if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
        if (req.files.bankGuaranteeDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.bankGuaranteeDocument[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: 'workOrderDocument is required' });
    }
    else if (!req.files.agreementDocument) {
        if (req.files.workOrderDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.workOrderDocument[0].filename) }
        if (req.files.bankGuaranteeDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.bankGuaranteeDocument[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: 'agreementDocument is required' });
    }
    else if (!req.files.bankGuaranteeDocument) {
        if (req.files.workOrderDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.workOrderDocument[0].filename) }
        if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
        return res
            .status(400)
            .send({ success: false, message: 'bankGuaranteeDocument is required' });
    }
    else {
        if (req.body.workOrderType == "SUB_WORKORDER") {
            var _mainWorkOrder = await WorkOrderModel.findOne({ _id: value.mainWorkOrderId });

            if (!_mainWorkOrder) {
                return res
                    .status(400)
                    .send({ success: false, message: "Main Workorder Id is invalid" });
            }
        }
        var _client = await ClientModel.findOne({ _id: value.client }).countDocuments();
        if (!_client) {
            return res
                .status(400)
                .send({ success: false, message: "Client not found" });
        }

        if (req.body.workOrderRoles) {
            const { success, message } = await WorkOrderValidations.validateWorkOrderRoles(req.body.workOrderRoles);
            if (!success) {
                if (req.files.workOrderDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.workOrderDocument[0].filename) }
                if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                if (req.files.bankGuaranteeDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.bankGuaranteeDocument[0].filename) }
                return res
                    .status(400)
                    .send({ success: false, message: message });
            }
        }

        var workOrderRolesIds = [];
        if (req.body.workOrderRoles) {
            req.body.workOrderRoles = JSON.parse(req.body.workOrderRoles);
            if (Array.isArray(req.body.workOrderRoles) && req.body.workOrderRoles.length > 0) {
                for (const workOrderRoles of req.body.workOrderRoles) {
                    const workOrderRolesData = {
                        role: workOrderRoles.role,
                        noOfManpower: workOrderRoles.noOfManpower,
                        branchName: workOrderRoles.branchName ? workOrderRoles.branchName : "",
                        siteAddress: workOrderRoles.siteAddress,
                        salary: workOrderRoles.salary
                    }
                    if (workOrderRoles._id) {
                        workOrderRolesIds.push(workOrderRoles._id)
                        await WorkOrderRolesModel.updateOne({ _id: workOrderRoles._id }, { $set: workOrderRolesData })
                    } else {
                        const _workOrderRolesData = new WorkOrderRolesModel(workOrderRolesData);
                        const result = await _workOrderRolesData.save();
                        if (result && result._id) {
                            workOrderRolesIds.push(result._id)
                        }
                    }
                }
            }
        }

        var WorkOrderModelData = {
            name: value.name,
            workOrderType: value.workOrderType,
            mainWorkOrderId: value.mainWorkOrderId,
            StartDate: value.StartDate,
            RenewalDate: value.RenewalDate,
            noOfRequirements: value.noOfRequirements,
            client: value.client,
            depositAmount: value.depositAmount,
            eprocReference: value.eprocReference,
            spoorthyReference: value.spoorthyReference,
            workOrderNumber: value.workOrderNumber,
            bankGuaranteeNumber: value.bankGuaranteeNumber,
            eprocDate: value.eprocDate,
            bankGuaranteeDate: value.bankGuaranteeDate,
            workOrderDate: new Date(),
            workOrderRoles: workOrderRolesIds,
            workOrderDocument: 'uploads/clients/' + value.client + "/" + req.files.workOrderDocument[0].filename,
            agreementDocument: 'uploads/clients/' + value.client + "/" + req.files.agreementDocument[0].filename,
            bankGuaranteeDocument: 'uploads/clients/' + value.client + "/" + req.files.bankGuaranteeDocument[0].filename
        };

        if (value.id) {
            await WorkOrderModel
                .findOne({ _id: value.id })
                .exec(async (err, result) => {
                    if (err) {
                        if (req.files.workOrderDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.workOrderDocument[0].filename) }
                        if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                        if (req.files.bankGuaranteeDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.bankGuaranteeDocument[0].filename) }
                        return res
                            .status(500)
                            .send({ success: false, message: 'Internal server error' })
                    }
                    var count = await WorkOrderModel.findOne({ _id: { $ne: value.id }, client: value.client, name: value.name }).countDocuments();
                    if (count) {
                        if (req.files.workOrderDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.workOrderDocument[0].filename) }
                        if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                        if (req.files.bankGuaranteeDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.bankGuaranteeDocument[0].filename) }
                        return res
                            .status(500)
                            .send({ success: false, message: 'WorkOrder already present with this client' });
                    }

                    var OldworkOrderDocument = result.workOrderDocument;
                    var OldagreementDocument = result.agreementDocument;
                    var OldbankGuaranteeDocument = result.bankGuaranteeDocument;
                    if (OldworkOrderDocument) {
                        fs.unlinkSync('./public/' + OldworkOrderDocument)
                    }
                    if (OldagreementDocument) {
                        fs.unlinkSync('./public/' + OldagreementDocument)
                    }
                    if (OldbankGuaranteeDocument) {
                        fs.unlinkSync('./public/' + OldbankGuaranteeDocument)
                    }

                    await WorkOrderModel
                        .updateOne({ _id: value.id }, { $set: WorkOrderModelData })
                        .exec((err, result) => {
                            if (err) {
                                if (req.files.workOrderDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.workOrderDocument[0].filename) }
                                if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                                if (req.files.bankGuaranteeDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.bankGuaranteeDocument[0].filename) }
                                return res
                                    .status(500)
                                    .send({ success: false, message: 'Internal server error' })
                            }
                            move('./public/uploads/clients/' + req.files.workOrderDocument[0].filename, './public/uploads/clients/' + value.client + "/" + req.files.workOrderDocument[0].filename);
                            move('./public/uploads/clients/' + req.files.agreementDocument[0].filename, './public/uploads/clients/' + value.client + "/" + req.files.agreementDocument[0].filename);
                            move('./public/uploads/clients/' + req.files.bankGuaranteeDocument[0].filename, './public/uploads/clients/' + value.client + "/" + req.files.bankGuaranteeDocument[0].filename);

                            ClientModel
                                .findOne({ _id: value.client })
                                .exec(async (err, result1) => {
                                    if (err) {
                                        return res
                                            .status(500)
                                            .send({ success: false, message: 'Internal server error' });
                                    }

                                    var TotalRequirements = 0;

                                    var WorkorderCollection = await WorkOrderModel.find({ client: result1._id })
                                    for (const data of WorkorderCollection) {
                                        if (data.noOfRequirements != undefined)
                                            TotalRequirements = TotalRequirements + data.noOfRequirements
                                    }
                                    var UpdateWorkorderCount = {
                                        workorderCount: (WorkorderCollection && WorkorderCollection.length > 0 ? WorkorderCollection.length : 0),
                                        employeeRequirement: TotalRequirements
                                    };
                                    await ClientModel.updateOne({ _id: value.client }, { $set: UpdateWorkorderCount });

                                })

                            return res
                                .status(200)
                                .send({ success: true, message: 'WorkOrder details updated successfully' })
                        })
                })
        }
        else {

            if (!fs.existsSync('./public/uploads/clients/' + value.client)) {
                fs.mkdirSync('./public/uploads/clients/' + value.client, { recursive: true });
            }

            var count = await WorkOrderModel.findOne({ client: value.client, name: value.name }).countDocuments();
            if (count) {
                if (req.files.workOrderDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.workOrderDocument[0].filename) }
                if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                if (req.files.bankGuaranteeDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.bankGuaranteeDocument[0].filename) }
                return res
                    .status(500)
                    .send({ success: false, message: 'WorkOrder already present with this client' });
            }

            var WorkOrderData = new WorkOrderModel(WorkOrderModelData);
            WorkOrderData.save((err, result) => {
                if (err) {
                    if (req.files.workOrderDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.workOrderDocument[0].filename) }
                    if (req.files.agreementDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.agreementDocument[0].filename) }
                    if (req.files.bankGuaranteeDocument) { fs.unlinkSync('./public/uploads/clients/' + req.files.bankGuaranteeDocument[0].filename) }
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' });
                }
                move('./public/uploads/clients/' + req.files.workOrderDocument[0].filename, './public/uploads/clients/' + value.client + "/" + req.files.workOrderDocument[0].filename);
                move('./public/uploads/clients/' + req.files.agreementDocument[0].filename, './public/uploads/clients/' + value.client + "/" + req.files.agreementDocument[0].filename);
                move('./public/uploads/clients/' + req.files.bankGuaranteeDocument[0].filename, './public/uploads/clients/' + value.client + "/" + req.files.bankGuaranteeDocument[0].filename);


                ClientModel
                    .findOne({ _id: value.client })
                    .exec(async (err, result) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ success: false, message: 'Internal server error' });
                        }

                        result.workorderCount = (result.workorderCount > 0) ? result.workorderCount : 0;
                        result.employeeRequirement = (result.employeeRequirement > 0) ? result.employeeRequirement : 0;
                        var UpdateWorkorderCount = {
                            workorderCount: (result.workorderCount + 1),
                            employeeRequirement: (result.employeeRequirement + value.noOfRequirements)
                        };
                        await ClientModel.updateOne({ _id: value.client }, { $set: UpdateWorkorderCount });

                    })


                return res
                    .status(200)
                    .send({ success: true, message: 'WorkOrder details added successfully', data: result });
            })
        }
    }

}

exports.deleteWorkOrder = async function (req, res) {
    const { error, value } = WorkOrderValidations
        .validate(WorkOrderValidations.ValidationTypes.WORKORDER_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        const count = await WorkOrderModel.findOne({ _id: value.id }).countDocuments();
        if (!count) {
            return res
                .status(500)
                .send({ success: false, message: 'WorkOrder id not found!' })
        }
        await WorkOrderModel
            .updateOne({ _id: value.id }, { $set: { isDeleted: true } })
            .exec(async (err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                await ClientModel
                    .findOne({ _id: result.client, isDeleted: false })
                    .exec(async (err, client) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ success: false, message: 'Internal server error' });
                        }

                        if (client.workorderCount != undefined || client.employeeRequirement != undefined) {
                            var UpdateWorkorderCount = {
                                workorderCount: (client.workorderCount - 1),
                                // employeeRequirement: (client.employeeRequirement - result.noOfRequirements)
                            }
                            await ClientModel.updateOne({ _id: value.client }, { $set: UpdateWorkorderCount });
                        }

                    })

                await EmployeeModel
                    .updateMany({ WorkOrder: value.id }, { $set: { isDeleted: true } })
                    .exec((err, result) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ success: false, message: 'Internal server error' })
                        }

                        return res
                            .status(200)
                            .send({ success: true, message: 'WorkOrder deleted successfully' })
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