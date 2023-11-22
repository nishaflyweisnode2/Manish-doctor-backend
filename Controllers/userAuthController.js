const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const otpGenerator = require('otp-generator');
const { Otp } = require('../Models/otpModel');
const cloudinary = require("../utils/cloudinary")
const asyncRapper = require("../Middlewares/asyncRapper")
const userModel = require("../Models/usersAuthModel")
const { StatusCodes } = require("http-status-codes");
const crypto = require('crypto');





// module.exports.signUp = async (req, res) => {
//     const { firstname, lastname, email, password, confirmPassword } = req.body
//     try {
//         if (firstname == '' || lastname == '' || email == '' /*|| phonenumber == ''*/ || password == '' || confirmPassword == '') {
//             res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//                 status: "Failed",
//                 message: "Empty Input Fields!"
//             })
//         } else {
//             const checkEmail = await userModel.findOne({ email })

//             if (checkEmail) {
//                 res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
//                     {
//                         code: 500,
//                         message: "User Already Exist"
//                     }
//                 );
//             } else {
//                 let findUser = await userModel.findOne({ email });
//                 const saltRounds = await bcrypt.genSalt(10);
//                 bcrypt.hash(password, saltRounds).then(hashedPassword => {
//                     const data = new userModel({
//                         firstname,
//                         lastname,
//                         email,
//                         // phonenumber,
//                         password: hashedPassword,

//                     });
//                     const accessToken = jwt.sign({
//                         id: data.id,
//                         phonenumber: req.body.phonenumber,
//                         firstname: req.body.firstname,
//                         lastname: req.body.lastname,
//                         email: req.body.email
//                     }, process.env.SECRETK, { expiresIn: "365d" });
//                     sendData = data.save()
//                     if (sendData) {
//                         res.status(StatusCodes.CREATED).json({
//                             code: StatusCodes.CREATED,
//                             Status: "success",
//                             message: "User Registered Successfully",
//                             accesstoken: accessToken,
//                             data
//                         })
//                     }
//                 })
//             }
//         }

//     }
//     catch (error) {
//         console.log(error)
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             error
//         })
//     }
// }

module.exports.signUp = async (req, res) => {
    const { firstname, lastname, email, phonenumber, password, confirmPassword } = req.body;

    try {
        if (firstname === '' || lastname === '' || email === '' || password === '' || confirmPassword === '') {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: "Failed",
                message: "Empty Input Fields!"
            });
        }

        if (password !== confirmPassword) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: "Failed",
                message: "Password and Confirm Password do not match!"
            });
        }

        const checkEmail = await userModel.findOne({ email });

        if (checkEmail) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                code: 500,
                message: "User Already Exist"
            });
        } else {
            const saltRounds = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const data = new userModel({
                firstname,
                lastname,
                email,
                password: hashedPassword,
            });

            const accessToken = jwt.sign({
                id: data.id,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email
            }, process.env.SECRETK, { expiresIn: "365d" });

            const sendData = await data.save();

            if (sendData) {
                return res.status(StatusCodes.CREATED).json({
                    code: StatusCodes.CREATED,
                    Status: "success",
                    message: "User Registered Successfully",
                    accesstoken: accessToken,
                    data
                });
            }
        }

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error
        });
    }
}

// module.exports.login = async (req, res) => {
//     const { phonenumber } = req.body
//     if (phonenumber == '') {
//         return res.status(401).json("Empty Field not Allowed");
//     } else {
//         try {
//             const checkuser = await userModel.findOne({ phonenumber })
//             if (checkuser) {
//                 const saltRounds = 10
//                 const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false });
//                 const otp = new Otp({ phonenumber: phonenumber, otp: OTP });
//                 const salt = await bcrypt.genSalt(saltRounds);
//                 otp.otp = await bcrypt.hash(otp.otp, salt);
//                 await otp.save();
//                 const data = {
//                     phonenumber: req.body.phonenumber || checkuser.phonenumber,
//                 };
//                 const accessToken = jwt.sign({
//                     id: checkuser._id,
//                     phonenumber: req.body.phonenumber,
//                     firstname: req.body.firstname,
//                     lastname: req.body.lastname
//                 }, process.env.SECRETK, { expiresIn: "365" });
//                 updateer = await userModel.findByIdAndUpdate(req.params.id, data, { new: true })
//                 res.status(200).json({
//                     accessToken,
//                     otp: OTP
//                 })
//             } else {
//                 res.status(401).json({
//                     stutus: "failed",
//                     message: "You are not a registered User"
//                 })

//             }
//         } catch (error) {
//             console.log(error)
//             res.status(500).json(error)
//         }
//     }
// }

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await userModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const saltRounds = 10;
                const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false });
                const salt = await bcrypt.genSalt(saltRounds);
                const hashedOTP = await bcrypt.hash(OTP, salt);

                const accessToken = jwt.sign({
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname
                }, process.env.SECRETK, { expiresIn: "365" });

                const otp = new Otp({ email, otp: hashedOTP });
                await otp.save();

                res.status(200).json({
                    accessToken,
                    otp: OTP
                });
            } else {
                res.status(401).json({ message: "Invalid password." });
            }
        } else {
            res.status(401).json({ message: "User not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports.socialLogin = async (req, res) => {
    try {
        const { firstname, lastname, email, socialType } = req.body;

        const existingUser = await userModel.findOne({
            $or: [{ email }],
        });

        if (existingUser) {
            const accessToken = jwt.sign({
                id: existingUser._id,
                email: existingUser.email,
                firstname: existingUser.firstname,
                lastname: existingUser.lastname
            }, process.env.SECRETK, { expiresIn: "365" });

            // const token = jwt.sign({ _id: existingUser._id }, process.env.SECRET_KEY);

            return res.status(200).json({
                status: 200,
                msg: "Login successfully",
                userId: existingUser._id,
                accessToken,
            });
        } else {
            const user = await userModel.create({ firstname, lastname, email, socialType, userType: "Distributor" });

            if (user) {
                const accessToken = jwt.sign({
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname
                }, process.env.SECRETK, { expiresIn: "365" });


                return res.status(200).json({
                    status: 200,
                    msg: "Login successfully",
                    userId: newUser._id,
                    accessToken,
                });
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, message: "Server error", error: err.message });
    }
};


module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetLink = `http://yourwebsite.com/reset-password/${resetToken}`;

        res.status(200).json({ message: 'Password reset link generated.', resetLink });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports.resetPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
    const token = req.params.token;

    try {
        if (!password || !confirmPassword) {
            return res.status(400).json({ message: 'New password and confirm password are required.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirm password do not match.' });
        }

        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset link is invalid or has expired.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;

        // Clear the reset token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



// module.exports.verifyOtp = async (req, res) => {
//     const { phonenumber } = req.body
//     try {
//         const checkusers = await userModel.findOne({ phonenumber })
//         if (checkusers) {
//             const otpHolder = await Otp.find({
//                 phonenumber: req.body.phonenumber
//             });
//             if (otpHolder.length === 0)
//                 return res.status(400).json("Expired OTP or Your Number Doesnt Correspond with This Token");
//             const rightOtpFind = otpHolder[otpHolder.length - 1];
//             const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp)

//             if (rightOtpFind.phonenumber === req.body.phonenumber && validUser) {
//                 const accessToken = jwt.sign({
//                     id: checkusers.id,
//                     phonenumber: checkusers.phonenumber

//                 }, process.env.SECRETK, { expiresIn: "365d" });
//                 await Otp.deleteMany({
//                     phonenumber: rightOtpFind.phonenumber
//                 });
//                 return res.status(200).send({
//                     message: "login Successful",
//                     token: accessToken,
//                     data: {
//                         "phonenumber": phonenumber,
//                         "id": checkusers._id,
//                     }
//                 })

//             } else {
//                 return res.status(400).json({ success: false, message: "OTP was wrong", status: 400 })
//             }
//         } else {
//             res.status(500).json(error)
//         }
//     } catch (error) {
//         res.status(500).json(error)
//     }
// }

module.exports.verifyOtp = async (req, res) => {
    const { email } = req.body
    try {
        const checkusers = await userModel.findOne({ email })
        if (checkusers) {
            const otpHolder = await Otp.find({
                email: req.body.email
            });
            if (otpHolder.length === 0)
                return res.status(400).json("Expired OTP or Your Number Doesnt Correspond with This Token");
            const rightOtpFind = otpHolder[otpHolder.length - 1];
            const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp)

            if (rightOtpFind.email === req.body.email && validUser) {
                const accessToken = jwt.sign({
                    id: checkusers.id,
                    email: checkusers.email

                }, process.env.SECRETK, { expiresIn: "365d" });
                await Otp.deleteMany({
                    email: rightOtpFind.email
                });
                return res.status(200).send({
                    message: "login Successful",
                    token: accessToken,
                    data: {
                        "email": email,
                        "id": checkusers._id,
                    }
                })

            } else {
                return res.status(400).json({ success: false, message: "OTP was wrong", status: 400 })
            }
        } else {
            res.status(500).json(error)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports.getallusers = async (req, res) => {
    try {
        const data = await userModel.find()
        if (data) {
            res.status(StatusCodes.OK).json({
                message: "success",
                status: StatusCodes.OK,
                countusers: data.length,
                data

            })
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Something Went Wrong",
                status: StatusCodes.INTERNAL_SERVER_ERROR
            })
        }
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something Wrong",
            status: "Failed"
        })
    }
}

module.exports.getuserprofile = async (req, res) => {
    try {
        const data = await userModel.findOne({ _id: req.user.id })
        //.populate({path:"userId"});
        res.status(200).json({
            message: "success",
            status: 200,
            data
        })
    }
    catch (error) {
        res.status(200).json({
            message: error
        })
    }
}

module.exports.updateusersprofile = async (req, res) => {
    try {
        let updateuser = await userModel.findById(req.params.id);
        //await cloudinary.uploader.destroy(updateuser.cloudinary_id);
        const result = await cloudinary.uploads(req.file.path);
        console.log(result);
        const data = {
            userspicture: result.url || updateuser.userspicture,
            firstname: req.body.firstname || updateuser.firstname,
            lastname: req.body.lastname || updateuser.lastname,
            email: req.body.email || updateuser.email,
            cloudinary_id: result.id || updateuser.cloudinary_id
        };
        updateuser = await userModel.findByIdAndUpdate(req.user.id, data, { new: true })
        res.status(200).json({
            message: "user profile updated successfuly",
            code: 200,
            data: updateuser
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
} 