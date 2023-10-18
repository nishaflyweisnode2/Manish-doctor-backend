const { StatusCodes } = require("http-status-codes");
const { Contact } = require("../Models/contactusModel");





module.exports.addContact = async (req, res) => {
    const { companyname, email, contactnumber, address } = req.body
    if (companyname === '' || email === '' || contactnumber === '' || !address.street || !address.city || !address.pincode) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: "Failed",
            message: "Required fields are missing or address fields are incomplete.",
        });
    } else {
        const Companyfind = await Contact.find()
        if (Companyfind.length > 0) {
            res.status(500).json({
                status: "Failed",
                message: "Contact Exist"
            })
        } else {
            try {
                const data = await new Contact({
                    companyname: companyname,
                    email: email,
                    contactnumber: contactnumber,
                    address: {
                        street: address.street,
                        city: address.city,
                        pincode: address.pincode,
                    },

                });
                await data.save()
                res.status(StatusCodes.CREATED).json({
                    status: "Success",
                    data,

                })
            }
            catch (error) {
                console.log(error)
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: "Failed",
                    message: "Oops!!! Error Occurs"
                })
            }
        }
    }
}


//Edit Product code

module.exports.editContact = async (req, res) => {

    try {
        let updateid = await Contact.findById(req.params.id);

        if (updateid) {
            const data = {
                companyname: req.body.companyname || updateid.companyname,
                email: req.body.email || updateid.email,
                contactnumber: req.body.contactnumber || updateid.contactnumber,
                address: req.body.address || updateid.address
            };
            Contactdetails = await Contact.findByIdAndUpdate(req.params.id, data, { new: true })
            res.status(StatusCodes.OK).json({
                message: "Contact updated successfuly",
                code: StatusCodes.OK,
                data: Contactdetails
            })
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                status: "failed",
                message: "Invalid Contact ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


//DELETE
module.exports.deleteContact = async (req, res) => {
    try {
        const contactid = await Contact.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Contact Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
};



//GET ALL CATEGPRIES
module.exports.getcontact = async (req, res) => {
    try {
        const data = await Contact.find();
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json(error)
    }
}

/* module.exports = router */