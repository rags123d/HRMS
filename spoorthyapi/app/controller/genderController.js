const GenderModel = require('../model/gender');

exports.getGender = async function (req, res) {
    GenderModel
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

exports.addGender = async function (req, res) {
    if (!req.body.name) {
        return res
        .status(400)
        .send({ success: false, message: "name is required" })
    }
    else{
        var count = await GenderModel.findOne({ name: req.body.name }).countDocuments();
        if(count){
            return res
                .status(500)
                .send({ success: false, message: 'Gender already present with this name' });
        }
        var GenderData = new GenderModel({
            name: req.body.name
        });
        GenderData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            return res
                .status(200)
                .send({ success: true, message: 'Gender details added successfully', data: result });
        })
    }
    
}