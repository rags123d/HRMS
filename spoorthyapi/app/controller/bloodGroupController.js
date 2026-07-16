const BloodGroupModel = require('../model/bloodGroup');

exports.getBloodGroup = async function (req, res) {
    BloodGroupModel
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

exports.addBloodGroup = async function (req, res) {
    if (!req.body.name) {
        return res
        .status(400)
        .send({ success: false, message: "name is required" })
    }
    else{
        var count = await BloodGroupModel.findOne({ name: req.body.name }).countDocuments();
        if(count){
            return res
                .status(500)
                .send({ success: false, message: 'BloodGroup already present with this name' });
        }
        var BloodGroupData = new BloodGroupModel({
            name: req.body.name
        });
        BloodGroupData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            return res
                .status(200)
                .send({ success: true, message: 'BloodGroup details added successfully', data: result });
        })
    }
    
}