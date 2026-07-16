const MaritalStatusModel = require('../model/maritalStatus');

exports.getMaritalStatus = async function (req, res) {
    MaritalStatusModel
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

exports.addMaritalStatus = async function (req, res) {
    if (!req.body.name) {
        return res
        .status(400)
        .send({ success: false, message: "name is required" })
    }
    else{
        var count = await MaritalStatusModel.findOne({ name: req.body.name }).countDocuments();
        if(count){
            return res
                .status(500)
                .send({ success: false, message: 'MaritalStatus already present with this name' });
        }
        var MaritalStatusData = new MaritalStatusModel({
            name: req.body.name
        });
        MaritalStatusData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            return res
                .status(200)
                .send({ success: true, message: 'MaritalStatus details added successfully', data: result });
        })
    }
    
}