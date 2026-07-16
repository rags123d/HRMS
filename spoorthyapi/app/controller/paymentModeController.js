const PaymentModeModel = require('../model/paymentMode');

exports.getPaymentMode = async function (req, res) {
    PaymentModeModel
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

exports.addPaymentMode = async function (req, res) {
    if (!req.body.name) {
        return res
            .status(400)
            .send({ success: false, message: "name is required" })
    }
    else {
        var count = await PaymentModeModel.findOne({ name: req.body.name }).countDocuments();
        if (count) {
            return res
                .status(500)
                .send({ success: false, message: 'Payment Mode already present with this name' });
        }
        var PaymentData = new PaymentModeModel({
            name: req.body.name
        });
        PaymentData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            return res
                .status(200)
                .send({ success: true, message: 'Payment Mode details added successfully', data: result });
        })
    }

}