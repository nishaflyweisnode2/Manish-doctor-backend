const jwt = require("jsonwebtoken");
const Aboutself = require("../Models/aboutSelfModel")
const { StatusCodes } = require("http-status-codes");



module.exports.AddAboutme = async (req, res) => {
    const { firstname, lastname, email, weight, age, bloodgroup } = req.body
    try {
        if (firstname == '' || lastname == '' || email == '' || weight == '' || bloodgroup == '' || age == '') {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: "Failed",
                message: "Empty Input Fields!"
            })
        } else {
            const checkuserID = await Aboutself.findOne({ userId: req.user.id })
            if (checkuserID) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                    {
                        code: 500,
                        message: "User About Already Exist"
                    }
                );
            } else {
                const data = new Aboutself({
                    firstname,
                    lastname,
                    email,
                    age,
                    weight,
                    bloodgroup,
                    userId: req.user.id

                });
                sendData = data.save()
                if (sendData) {
                    res.status(StatusCodes.CREATED).json({
                        code: StatusCodes.CREATED,
                        Status: "success",
                        message: "About Me Added",
                        data
                    })
                }

            }
        }

    }
    catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error
        })
    }
}


module.exports.getAboutMe = async (req, res) => {
    try {

        const aboutMeData = await Aboutself.findOne({ userId: req.user.id }).populate('userId');

        if (!aboutMeData) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: "Not Found",
                message: "About Me data not found for the user",
            });
        }

        return res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            status: "success",
            message: "About Me data retrieved",
            data: aboutMeData,
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: error.message,
        });
    }
};
