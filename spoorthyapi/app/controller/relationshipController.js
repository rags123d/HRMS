const RelationshipModel = require('../model/relationship');
const RelationshipValidations = require('../validations/relationshipValidations');

exports.getRelationship = async function (req, res) {
    RelationshipModel
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

exports.addRelationship = async function (req, res) {
    if (!req.body.name) {
        return res
            .status(400)
            .send({ success: false, message: "name is required" })
    }
    else {
        var count = await RelationshipModel.findOne({ name: req.body.name }).countDocuments();
        if (count) {
            return res
                .status(500)
                .send({ success: false, message: 'Relationship already present with this name' });
        }
        var RelationshipData = new RelationshipModel({
            name: req.body.name
        });
        RelationshipData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            return res
                .status(200)
                .send({ success: true, message: 'Relationship details added successfully', data: result });
        })
    }
}

exports.editRelationship = async function (req, res) {
    const { error, value } = RelationshipValidations
        .validate(RelationshipValidations.ValidationTypes.RELATIONSHIP_EDIT, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await RelationshipModel
            .updateOne({ _id: value.id }, { $set: { name: value.name } })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Relationship deleted successfully' })
            })
    }
}

exports.deleteRelationship = async function (req, res) {
    const { error, value } = RelationshipValidations
        .validate(RelationshipValidations.ValidationTypes.RELATIONSHIP_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await RelationshipModel
            .deleteOne({ _id: value.id })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Relationship deleted successfully' })
            })
    }
}
