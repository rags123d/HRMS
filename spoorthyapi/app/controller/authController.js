const jwt = require('jsonwebtoken');
const MobileOtpModel = require('../model/mobileOtp');
const UserModel = require('../model/user');
const RoleModel = require('../model/role');
const Enum = require('../constants/enum')
const AuthValidations = require('../validations/authValidations');
const GeneralUtils = require('../utils/generalUtils');
const config = require("../config/app");
const axios = require("axios");
const SharedUserModel = require('../model/sharedUsers');
// const tinyurl = require('tinyurl');

/////Mobile Auth/////
exports.sendOtp = function (req, res) {
    const { error, value } = AuthValidations.validate(AuthValidations.ValidationTypes.SEND_OTP, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    } else {
        if (!value.mobile) {
            return res
                .status(400)
                .send({ success: false, message: 'Mobile No. is required' })
        }
        UserModel.findOne({ mobile: value.mobile })
            .exec(async (err, _result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' });
                }
                if (!_result) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'This number is not registered with us. Please contact support team.' });
                }
                const otp = GeneralUtils.generateOTP();
                if (otp) {
                    GeneralUtils.sendOtp(otp, value.mobile)
                        .then((result) => {
                            console.log('OTP result ', result);
                            var mobileData = new MobileOtpModel({
                                mobile: value.mobile,
                                otp: otp
                            });
                            mobileData.save((err, result) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }
                                return res
                                    .status(200)
                                    .send({ success: true, message: 'OTP sent', otp: otp });
                            })
                        })
                }
            })

    }
}

exports.verifyOtp = function (req, res) {
    const { error, value } = AuthValidations
        .validate(AuthValidations.ValidationTypes.VERIFY_OTP, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    } else {
        if (!value.mobile) {
            return res
                .status(400)
                .send({ success: false, message: 'Mobile No. is required' })
        }
        MobileOtpModel
            .findOne({ mobile: value.mobile, verified: false })
            .sort({ createdAt: -1 })
            .exec(async (err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ success: false, message: 'Internal server error' });
                } else {
                    if (result && result.otp == value.otp) {
                        await MobileOtpModel
                            .updateOne({ mobile: value.mobile, otp: value.otp }, { $set: { verified: true } });

                        UserModel.findOne({ mobile: value.mobile })
                            .populate('role')
                            .populate('gender')
                            .exec(async (err, result) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: 'Internal server error' });
                                }

                                result.loggedInDatetime = new Date()
                                result.isLeave = false
                                result.statusDatetime = new Date()

                                if (result.loggedInDatetime.getTime() >= result.endOfDay.getTime()) {
                                    result.endOfDay = new Date().setHours(23, 59, 59, 999)
                                    result.approved = 0
                                }

                                await UserModel.updateOne({ _id: result._id }, { $set: result })

                                const token = jwt.sign({
                                    user: {
                                        mobile: value.mobile,
                                        role: result.role.name,
                                        userName: result.userName,
                                    },
                                }, process.env.SCERET_KEY, {
                                    expiresIn: process.env.TOKEN_EXPIRY
                                });
                                const refreshToken = jwt.sign({
                                    user: {
                                        mobile: value.mobile,
                                        role: result.role.name,
                                        userName: result.userName,
                                    },
                                }, process.env.REFRESH_TOKEN_SECRET_KEY, {
                                    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
                                });
                                return res.
                                    status(200)
                                    .send({
                                        success: true,
                                        data: {
                                            user: result,
                                            token: token,
                                            refreshToken: refreshToken
                                        }, message: 'OTP verified'
                                    })
                            })


                    } else {
                        return res
                            .status(400)
                            .send({ success: false, message: 'Invalid OTP' })
                    }
                }
            })
    }
}

exports.refreshTokenMobile = function (req, res, next) {
    const refreshToken = req.body.token || req.query.authorization || req.headers.authorization;
    if (refreshToken) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, function (err, decoded) {
            if (err) {
                return res
                    .status(401)
                    .send({ success: false, message: 'Failed to authenticate token. 1' });
            } else {
                const user = decoded.user;
                if (user && user.mobile) {
                    if (user.role == Enum.ADMIN_ROLE.FIELD_OFFICER || user.role == Enum.ADMIN_ROLE.GENERAL_MANAGER || user.role == Enum.ADMIN_ROLE.MANAGING_DIRECTOR || user.role == Enum.ADMIN_ROLE.ADMIN) {
                        return UserModel
                            .findOne({
                                mobile: user.mobile,
                            })
                            .populate('role')
                            .populate('gender')
                            .exec((err, result) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ success: false, message: "Internal server error" })
                                } else if (!result) {
                                    return res
                                        .status(401)
                                        .send({ success: false, message: 'Failed to authenticate token. 3' });
                                } else {
                                    const token = jwt.sign({
                                        user: {
                                            mobile: result.mobile,
                                            role: result.role.name,
                                            userName: result.userName,
                                        },
                                    }, process.env.SCERET_KEY, {
                                        expiresIn: process.env.TOKEN_EXPIRY
                                    });
                                    return res.
                                        status(200)
                                        .send({ success: true, token: token })
                                }
                            })
                    }
                }
                return res
                    .status(401)
                    .send({ success: false, message: 'Failed to authenticate token. 4' });
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};

/////Web Auth/////
const decodeBase64 = (value) => {
    try {
        return Buffer.from(value, 'base64').toString('utf8');
    } catch (e) {
        return value;
    }
};

exports.login = async function (req, res) {
    const { error, value } = AuthValidations
        .validate(AuthValidations.ValidationTypes.ADMIN_LOGIN, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) });
    }

    try {
        let userNameData = value.userName;
        let passwordData = value.password;

        const findUser = async (username) => {
            let user = await UserModel.findOne({ userName: username }).populate('role').populate('gender').exec();
            if (!user) {
                const decoded = decodeBase64(username);
                if (decoded !== username) {
                    user = await UserModel.findOne({ userName: decoded }).populate('role').populate('gender').exec();
                }
            }
            return user;
        };

        const user = await findUser(userNameData);
        if (!user) {
            return res.status(400).send({ success: false, message: 'Invalid Credentials' });
        }

        const decodedSubmittedPassword = decodeBase64(passwordData);
        const storedPasswordDecoded = decodeBase64(user.password);

        const passwordMatch = (passwordData === user.password)
            || (decodedSubmittedPassword === user.password)
            || (passwordData === storedPasswordDecoded)
            || (decodedSubmittedPassword === storedPasswordDecoded);

        const userMatch = (userNameData === user.userName) || (userNameData === decodeBase64(user.userName));

        if (!userMatch || !passwordMatch) {
            return res.status(400).send({ success: false, message: 'Invalid Credentials' });
        }

        const token = jwt.sign({
            user: {
                userName: user.userName,
                role: user.role.name
            },
        }, process.env.SCERET_KEY, { expiresIn: process.env.TOKEN_EXPIRY });

        const refreshToken = jwt.sign({
            user: {
                userName: user.userName,
                role: user.role.name
            },
        }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

        return res.status(200).send({
            success: true,
            message: 'Login successfull',
            data: {
                user: GeneralUtils.decrypt(user.userName),
                role: user.role.name,
                accessToken: token,
                refreshToken: refreshToken
            }
        });

    } catch (err) {
        console.error('error - controller', err);
        return res.status(500).send({ success: false, message: 'Internal server error' });
    }
};

exports.forgotPassword = async function (req, res) {
    const { error, value } = AuthValidations
        .validate(AuthValidations.ValidationTypes.ADMIN_FORGOT_PASSWORD, req.body);

    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    }
    else {
        try {
            var userName = value.userName
            var email = GeneralUtils.decrypt(value.email)
            UserModel
                .findOne({ userName: userName, email: email })
                .exec(async (err, data) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ success: false, message: 'Internal server error' });
                    } else if (!data) {
                        return res
                            .status(400)
                            .send({ success: false, message: 'Invalid Credentials' });
                    }

                    return res
                        .status(200)
                        .send({
                            success: true, message: "Credentials Retrieved",
                            data: {
                                userName: GeneralUtils.decrypt(data.userName),
                                password: GeneralUtils.decrypt(data.password),
                                email: data.email
                            }
                        })
                })
        } catch (err) {
            console.log("error - controller ", error);
            return res
                .status(500)
                .send({ success: false, message: 'Internal server error' });
        }
    }
}

exports.refreshTokenWeb = function (req, res, next) {
    const refreshToken = req.body.token || req.query.authorization || req.headers.authorization;
    if (refreshToken) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, async function (err, decoded) {
            if (err) {
                return res
                    .status(401)
                    .send({ success: false, message: 'Failed to authenticate token. 1' });
            }
            const user = decoded.user;
            if (user) {
                if (user.role == Enum.ADMIN_ROLE.FIELD_OFFICER || user.role == Enum.ADMIN_ROLE.HR || user.role == Enum.ADMIN_ROLE.SR_HR ||
                    user.role == Enum.ADMIN_ROLE.ACCOUNT_TEAM || user.role == Enum.ADMIN_ROLE.GENERAL_MANAGER ||
                    user.role == Enum.ADMIN_ROLE.MANAGING_DIRECTOR || user.role == Enum.ADMIN_ROLE.ADMIN) {
                    return await UserModel
                        .findOne({ userName: user.userName })
                        .exec((err, result) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .send({ success: false, message: "Internal server error" })
                            } else if (!result) {
                                return res
                                    .status(401)
                                    .send({ success: false, message: 'Failed to authenticate token. 3' });
                            } else {
                                const token = jwt.sign({
                                    user: {
                                        userName: result.userName,
                                        role: result.role.name
                                    },
                                }, process.env.SCERET_KEY, {
                                    expiresIn: process.env.TOKEN_EXPIRY
                                });
                                return res.
                                    status(200)
                                    .send({ success: true, token: token })
                            }
                        })
                }
            }
            return res
                .status(401)
                .send({ success: false, message: 'Failed to authenticate token. 4' });

        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};


// Shared Link User Number //
// exports.sharedUser = async function (req, res) {
//     const { error, value } = AuthValidations
//         .validate(AuthValidations.ValidationTypes.SEND_SMS, req.body);

//     if (error) {
//         return res
//             .status(400)
//             .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
//     }
//     else {
//         var count = await SharedUserModel.findOne({ phoneNo: value.phoneNo }).countDocuments();
//         if (count) {
//             return res
//                 .status(500)
//                 .send({ success: false, message: 'For this User mobile number Already Shared a Link!' });
//         }

//         var SharedUserData = new SharedUserModel({
//             name: value.name,
//             phoneNo: value.phoneNo,
//         });

//         SharedUserData.save((err, result) => {
//             if (err) {
//                 return res
//                     .status(500)
//                     .send({ success: false, message: 'Internal server error' });
//             }
//             return res
//                 .status(200)
//                 .send({ success: true, message: 'Shared User details added successfully', data: result });
//         })
//     }
// }


//Send SMS//

exports.sendSMS = async function (req, res) {
    const { error, value } = AuthValidations.validate(AuthValidations.ValidationTypes.SEND_SMS, req.body);
    if (error) {
        return res
            .status(400)
            .send({ success: false, message: GeneralUtils.getJoiErrorMessage(error) })
    } else {
        if (!value.phoneNo) {
            return res
                .status(400)
                .send({ success: false, message: 'Mobile No. is required' })
        }
        else if (!value.name) {
            return res
                .status(400)
                .send({ success: false, message: 'Name is required' })
        }
        else if (!value.sharelink) {
            return res
                .status(400)
                .send({ success: false, message: 'Link is required' })
        }

        var count = await SharedUserModel.findOne({ phoneNo: value.phoneNo }).countDocuments();
        if (count) {
            return res
                .status(500)
                .send({ success: false, message: 'For this User mobile number Already Shared a Link!' });
        }

        var SharedUserData = new SharedUserModel({
            name: value.name,
            phoneNo: value.phoneNo,
            sharelink: value.sharelink,
        });

        SharedUserData.save((err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' });
            }
            // return res
            //     .status(200)
            //     .send({ success: true, message: 'Shared User details added successfully', data: result });
        })

        const { smsApiKey, smsSenderId } = config;

        // const query = `name=${value.name}&phoneNo=${value.phoneNo}`;
        const query = `${value.phoneNo}`;
        // const openLink = `http://148.72.213.34/SpoorthyAdmin/openlinkForm?${query}`;
        // wizlite.in/S/{mobileNo}

        const openLink = `http://wizlite.in/S/${query}`;
        const message = `Welcome to Spoorthy Group. We're so excited to have you onboard, please click here ${openLink} to submit your details. Powered by Wizlite.`;


        const phoneNo = value.phoneNo
        const response = await axios.post(
            // `https://api-alerts.kaleyra.com/v4/?api_key=${smsApiKey}&method=sms&message=${message}&to=${phoneNo}&sender=${smsSenderId}`SPRTYG
            `https://api-alerts.kaleyra.com/v4/?api_key=A088baef081265e84761270ea16e7e2fc&method=sms&message=${message}&to=${phoneNo}&sender=DEODKS`
            // `https://api-alerts.kaleyra.com/v4/?api_key=A088baef081265e84761270ea16e7e2fc&method=sms&message={0}&to={1}&sender=DEODKS
        );
        console.log(response);
        // return response;

        return res
            .status(200)
            .send({
                success: true,
                data: response.data,
            })



        // tinyurl.shorten(openLink, async function (shortUrl) {
        //     // Replace "Click here" text in message with clickable link
        //     const messageWithLink = message.replace('"clickhere"', `${shortUrl}`);
        //     // Code for sending SMS message using Twilio or another SMS API service goes here

        //     const phoneNo = value.phoneNo
        //     const response = await axios.post(
        //         // `https://api-alerts.kaleyra.com/v4/?api_key=${smsApiKey}&method=sms&message=${message}&to=${phoneNo}&sender=${smsSenderId}`SPRTYG
        //         `https://api-alerts.kaleyra.com/v4/?api_key=A088baef081265e84761270ea16e7e2fc&method=sms&message=${messageWithLink}&to=${phoneNo}&sender=DEODKS`
        //         // `https://api-alerts.kaleyra.com/v4/?api_key=A088baef081265e84761270ea16e7e2fc&method=sms&message={0}&to={1}&sender=DEODKS
        //     );
        //     console.log(response);
        //     // return response;

        //     return res
        //         .status(200)
        //         .send({
        //             success: true,
        //             data: response.data,
        //         })
        // });
    }
};

exports.GetSMSLink = async function (req, res) {

    var count = await SharedUserModel.findOne({ phoneNo: req.params.mobileNo }).countDocuments();
    if (!count) {
        return res
            .status(500)
            .send({ success: false, message: 'User dose not exist with this mobile number' });
    }

    SharedUserModel
        .findOne({ phoneNo: req.params.mobileNo })
        .exec(async (err, result) => {
            if (err) {
                return res
                    .status(500)
                    .send({ success: false, message: 'Internal server error' })
            }
            if (result && result.sharelink) {
                return res
                    .status(200)
                    .send({ success: true, data: result.sharelink, message: 'Updated User correction successfully' })
            }
        })
}