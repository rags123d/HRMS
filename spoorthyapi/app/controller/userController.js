const UserModel = require('../model/user');
const RoleModel = require('../model/role');
const GenderModel = require('../model/gender');
const UserValidations = require('../validations/userValidations')
const GeneralUtils = require('../utils/generalUtils')
var fs = require('fs');

exports.getUser = async function (req, res) {
    UserModel
        .find({})
        .populate('role')
        .populate('gender')
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

exports.getUserById = async function (req, res) {
    const { error, value } = UserValidations
        .validate(UserValidations.ValidationTypes.USER_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    UserModel
        .findOne({ _id: value.id })
        .populate('role')
        .populate('gender')
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

// exports.addUser = async function (req, res) {
//     const { error, value } = UserValidations
//         .validate(UserValidations.ValidationTypes.ADD_USER, req.body);

//     if (error) {
//         return res
//             .status(400)
//             .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
//     } else if (!req.files.photo) {
//         return res
//             .status(400)
//             .send({ success: false, message: 'Photo is required' });
//     }

//     var count = await UserModel.findOne({ mobile: value.mobile }).countDocuments();
//     if (count) {
//         return res
//             .status(500)
//             .send({ success: false, message: 'User already present with this mobile number' });
//     }

//     var rolecount = await RoleModel.find({ _id: value.role }).countDocuments();
//     if (!rolecount) {
//         return res
//             .status(500)
//             .send({ success: false, message: 'Role not found' });
//     }

//     var gendercount = await GenderModel.find({ _id: value.gender }).countDocuments();
//     if (!gendercount) {
//         return res
//             .status(500)
//             .send({ success: false, message: 'Gender not found' });
//     }

//     var UserData = new UserModel({
//         mobile: value.mobile,
//         role: value.role,
//         firstName: value.firstName,
//         lastName: value.lastName,
//         userName: GeneralUtils.encrypt(value.userName),
//         password: GeneralUtils.encrypt(value.password),
//         email: value.email,
//         age: value.age,
//         gender: value.gender,
//         place: value.place,
//         languages: value.languages
//     });

//     UserData.save(async (err, result) => {
//         console.log('Inside');
//         if (err) {
//             return res
//                 .status(500)
//                 .send({ success: false, message: 'Internal server error' });
//         }

//         if (!fs.existsSync('./public/uploads/users/' + UserData._id)) {
//             fs.mkdirSync('./public/uploads/users/' + UserData._id, { recursive: true });
//         }

//         if (req.files.photo
//             && req.files.photo.length
//             && req.files.photo[0]) {
//             UserData['photo'] = 'uploads/users/' + UserData._id + "/" + req.files.photo[0].filename;
//         }

//         await UserModel
//             .updateOne({ _id: UserData._id }, { $set: UserData })
//             .exec(async (err, result1) => {
//                 console.log('Inside');
//                 if (err) {
//                     return res
//                         .status(500)
//                         .send({ success: false, message: 'Internal server error' })
//                 }

//                 if (req.files.photo
//                     && req.files.photo.length
//                     && req.files.photo[0]) {
//                     fs.rename('./public/uploads/users/' + req.files.photo[0].filename, './public/uploads/users/' + UserData._id + "/" + req.files.photo[0].filename, (err) => {
//                         if (err) throw err;
//                         else console.log('Photo Successfully moved');
//                     });
//                 }

//                 return res
//                     .status(200)
//                     .send({ success: true, message: 'Success', data: result });
//             })
//     })
// }

exports.addUser = async function (req, res) {
    const { error, value } = UserValidations
        .validate(UserValidations.ValidationTypes.ADD_USER, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        var count = await UserModel.findOne({ mobile: value.mobile }).countDocuments();
        if (count) {
            return res
                .status(500)
                .send({ success: false, message: 'User already present with this mobile number' });
        }

        var rolecount = await RoleModel.find({ _id: value.role }).countDocuments();
        if (!rolecount) {
            return res
                .status(500)
                .send({ success: false, message: 'Role not found' });
        }

        var gendercount = await GenderModel.find({ _id: value.gender }).countDocuments();
        if (!gendercount) {
            return res
                .status(500)
                .send({ success: false, message: 'Gender not found' });
        }

        var UserData = new UserModel({
            mobile: value.mobile,
            role: value.role,
            firstName: value.firstName,
            lastName: value.lastName,
            userName: GeneralUtils.encrypt(value.userName),
            password: GeneralUtils.encrypt(value.password),
            email: value.email,
            age: value.age,
            gender: value.gender,
            presentAddress: value.presentAddress,
            permanentAddress: value.permanentAddress
        });

        UserData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            return res
                .status(200)
                .send({ success: true, message: 'User details added successfully', data: result });
        })
    }
}

exports.setStatus = async function (req, res) {
    const { error, value } = UserValidations
        .validate(UserValidations.ValidationTypes.SET_STATUS, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    var StatusData = {
        isLeave: value.isLeave,
        statusDatetime: new Date()
    }

    await UserModel
        .findOne({ _id: value.id })
        .exec(async (err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' })
            } else if (!result) {
                return res
                    .status(400)
                    .send({ success: false, message: 'User not found' })
            } else {
                await UserModel.updateOne({ _id: result._id }, { $set: StatusData })
                const UserData = await UserModel
                    .findOne({ _id: value.id })

                return res
                    .status(200)
                    .send({ success: true, message: "Status Updated", data: UserData })
            }
        })
}

exports.setLocation = async function (req, res) {
    const { error, value } = UserValidations
        .validate(UserValidations.ValidationTypes.SET_LOCATION, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }

    var LocationData = {
        latitude: value.latitude,
        longitude: value.longitude,
        locationRemark: value.locationRemark,
        locationDatetime: new Date()
    }

    await UserModel
        .findOne({ _id: value.id })
        .exec(async (err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' })
            } else if (!result) {
                return res
                    .status(400)
                    .send({ success: false, message: 'User not found' })
            } else {
                await UserModel.updateOne({ _id: result._id }, { $set: LocationData })

                return res
                    .status(200)
                    .send({ success: true, message: "Location Updated" })
            }
        })

}

exports.editUser = async function (req, res) {
    const { error, value } = UserValidations
        .validate(UserValidations.ValidationTypes.EDIT_USER, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        var count = await UserModel.findOne({ mobile: value.mobile, _id: { $ne: value.id }  }).countDocuments();
        if (count) {
            return res
                .status(500)
                .send({ success: false, message: 'User already present with this mobile number' });
        }

        var rolecount = await RoleModel.find({ _id: value.role }).countDocuments();
        if (!rolecount) {
            return res
                .status(500)
                .send({ success: false, message: 'Role not found' });
        }

        var gendercount = await GenderModel.find({ _id: value.gender }).countDocuments();
        if (!gendercount) {
            return res
                .status(500)
                .send({ success: false, message: 'Gender not found' });
        }


        await UserModel
            .updateOne({ _id: value.id },
                {
                    $set:
                    {
                        mobile: value.mobile,
                        role: value.role,
                        firstName: value.firstName,
                        lastName: value.lastName,
                        userName: GeneralUtils.encrypt(value.userName),
                        // password: GeneralUtils.encrypt(value.password),
                        email: value.email,
                        age: value.age,
                        gender: value.gender,
                        presentAddress: value.presentAddress,
                        permanentAddress: value.permanentAddress
                    }
                })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'Updated User correction successfully' })
            })
    }
}

exports.deleteUser = async function (req, res) {
    const { error, value } = UserValidations
        .validate(UserValidations.ValidationTypes.USER_ID, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        await UserModel
            .deleteOne({ _id: value.id })
            .exec((err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' })
                }

                return res
                    .status(200)
                    .send({ success: true, message: 'User deleted successfully' })
            })
    }
}