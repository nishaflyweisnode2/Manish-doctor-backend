const { StatusCodes } = require("http-status-codes");
const { Support } = require("../Models/supportModel");





module.exports.addsupport = async (req, res) => {
    const { name, email, contactnumber, message, userID } = req.body
    if (name == '' || email == '' || contactnumber == '' || message == '') {
        res.status(StatusCodes.BAD_REQUEST).json({
            status: "Failed",
            message: "Empty Field Not Accepted"
        })
    } else {
        try {
            const data = await new Support({
                name: name,
                email: email,
                contactnumber: contactnumber,
                message: message,
                userID: req.user.id

            })
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


//Edit Product code

/* module.exports.editContact = async (req, res) => {
   
    try {
        let updateid = await Support.findById(req.params.id);
       
        if(updateid){
        const data={
            name:req.body.name || updateid.name,
            email:req.body.email || updateid.email,  
            contactnumber:req.body.contactnumber || updateid.contactnumber,
            message:req.body.message || updateid.message
        };
        Contactdetails=await Support.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Support updated successfuly",
            code:StatusCodes.OK,
            data:Contactdetails
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Support ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
} */


//DELETE
module.exports.deletesupport = async (req, res) => {
    try {
        const contactid = await Support.findByIdAndDelete(req.params.id)
        res.status(StatusCodes.OK).json({ message: "Support Deleted Successfully" })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Something Went Wrong" })
    }
};


module.exports.getsinglesupport = async (req, res) => {
    try {
        const contactid = await Support.findById(req.params.id)
        if (contactid) {
            res.status(StatusCodes.OK).json({ message: "success", contactid })
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Invalid Support ID", status: "Failed" })
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
};



//GET ALL CATEGPRIES
module.exports.getallsupport = async (req, res) => {
    try {
        const data = await Support.find();
        res.status(StatusCodes.OK).json(data);

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

/* module.exports = router */