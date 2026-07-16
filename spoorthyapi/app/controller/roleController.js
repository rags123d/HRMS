const RoleModel = require('../model/role');

exports.getRole = async function (req, res) {
    RoleModel
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

exports.addRole = async function (req, res) {
    if(!req.body.name){
        return res
            .status(500)
            .send({ success: false, message: 'Role name is required.' });
    }
    var count = await RoleModel.findOne({ name: req.body.name}).countDocuments();
    if(count){
        return res
            .status(500)
            .send({ success: false, message: 'Role already present with this name' });
    }
    var RoleData = new RoleModel({
        name: req.body.name
    });
    RoleData.save((err, result) => {
        if (err) {
            return res
                .status(500)
                .send({ success: false, message: 'Internal server error' });
        }
        return res
            .status(200)
            .send({ success: true, message: 'success', data: result });
    })
    
}