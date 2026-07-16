const OccupationModel = require('../model/occupation');

exports.getOccupation = async function (req, res) {
    OccupationModel
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

exports.addOccupation = async function (req, res) {
    if (!req.body.name) {
        return res
        .status(400)
        .send({ success: false, message: "name is required" })
    }
    else{
        var count = await OccupationModel.findOne({ name: req.body.name }).countDocuments();
        if(count){
            return res
                .status(500)
                .send({ success: false, message: 'Occupation already present with this name' });
        }
        var OccupationData = new OccupationModel({
            name: req.body.name
        });
        OccupationData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            return res
                .status(200)
                .send({ success: true, message: 'Occupation details added successfully', data: result });
        })
    }
    
}