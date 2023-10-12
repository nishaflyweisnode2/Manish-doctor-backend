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
