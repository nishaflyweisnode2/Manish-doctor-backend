const { StatusCodes } = require("http-status-codes");
const  Testpreference = require("../Models/testpreferenceModel");
const {Booking} = require("../Models/BookingMode");



module.exports.addBook = async (req, res) => {
    const {
        Patientname,
        dob,
        mobile,
        email,
        streetno,
        zipno,
        landmark,
        lng,
        lat,
        city,
        state,
        slot,
        available,
        preferenceID,
        userID,
        fees,
        specialist
    }=req.body
    if(Patientname=='' ||
        dob=='' ||
        mobile=='' ||
        email=='' ||
        streetno=='' ||
        zipno=='' ||
        landmark=='' ||
        lng=='' ||
        lat=='' ||
        city=='' ||
        state=='' ||
        slot=='' ||
        available=='' ||
        preferenceID=='' ||
        userID=='' ||
        fees=='' ||
        specialist==''){
        res.status(StatusCodes.BAD_REQUEST).json({
            status:"Failed",
            message:"Empty Field Not Accepted"
        })
    }else{
        const check=await Booking.findOne({preferenceID})
         if(check){
             res.status(StatusCodes.CONFLICT).json({
                 status:"Failed",
                 message:"You have appintment already for this test"
             })
         }else{
            const idcheck=await Testpreference.findOne({_id:req.body.preferenceID})
            try{
                
                 const data= await new Booking({
                    Patientname: req.body.Patientname,   
                    dob: req.body.dob,  
                    mobile: req.body.mobile,  
                    email: req.body.email,  
                    streetno: req.body.streetno,  
                    zipno: req.body.zipno,  
                    landmark: req.body.landmark,  
                    lng: req.body.lng,  
                    lat: req.body.lat,  
                    city: req.body.city,  
                    state: req.body.state,  
                    slot: req.body.slot,  
                    available: req.body.available,  
                    preferenceID: req.body.preferenceID,  
                    specialist: req.body.specialist,  
                    userID: req.user.id,  
                    fees: idcheck.preferenceprice
                
                 })
                     await data.save()
                     res.status(StatusCodes.CREATED).json({
                         status:"Success",
                         data,
                         
                     })  
                }
                catch(error){
                 console.log(error)
                 res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                     status:"Failed",
                     message:"Oops!!! Error Occurs"
                 })
                } 
             }
    }
}


//Edit Product code

module.exports.editbooking = async (req, res) => {
   
    try {
        let updateid = await Booking.findById(req.params.id);
        const {preferenceID}=req.body
        const idcheck=await Testpreference.findOne({_id:preferenceID})

        if(updateid){
        const data={
            Patientname: req.body.Patientname || updateid.Patientname,   
            dob: req.body.dob || updateid.dob,  
            mobile: req.body.mobile || updateid.mobile,  
            email: req.body.email || updateid.email,  
            streetno: req.body.streetno || updateid.streetno,  
            zipno: req.body.zipno || updateid.zipno,  
            landmark: req.body.landmark || updateid.landmark,  
            lng: req.body.lng || updateid.lng, 
            lat: req.body.lat || updateid.lat,  
            city: req.body.city || updateid.city,  
            state: req.body.state || updateid.state,  
            slot: req.body.slot || updateid.slot,  
            available: req.body.available || updateid.available,  
            preferenceID: req.body.preferenceID || updateid.preferenceID,  
            specialist: req.body.specialist || updateid.specialist,  
            userID: req.user.id || updateid.userID,  
            fees: idcheck.preferenceprice || updateid.fees, 
        };
        datas=await Booking.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Booking updated successfuly",
            code:StatusCodes.OK,
            data:datas
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Booking ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


//DELETE
module.exports.deleteBooking = async (req, res) => {
    try {
        const bookingid=await Booking.findByIdAndDelete(req.params.id)
        if(bookingid){
            res.status(StatusCodes.OK).json({ message: "Booking Deleted Successfully"})
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Booking ID"})
        }
        
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Something Went Wrong" })
    }
};

//GET SINGLE Category BY USERS AND ADMIN
module.exports.getbookingbyid =  async (req, res) => {
    try {
        const singleBooking = await Booking.findById(req.params.id)
        .populate("preferenceID")
        .populate("specialist")
        .populate("userID")
        if(singleBooking){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singleBooking
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Booking ID"
            })
        }
        

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}
module.exports.getBookingbypreferenceid =  async (req, res) => {
    const ids=req.params.preferenceID
    //const params=req.params.id
    try {
        const singlebooking = await Booking.find({preferenceID:ids})
        .populate("preferenceID")
        .populate("specialist")
        .populate("userID")
        if(singlebooking){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singlebooking
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Booking ID"
            })
        }
        

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}
module.exports.getBookingbyuserid =  async (req, res) => {
    const ids=req.user.id
    //const params=req.params.id
    try {
        const singlebooking = await Booking.find({userID:ids})
        .populate("preferenceID")
        .populate("specialist")
        .populate("userID")
        if(singlebooking){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singlebooking
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Booking ID"
            })
        }
        

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

//GET ALL CATEGPRIES
module.exports.getallBooking =  async (req, res) => {
    try {
        const data = await Booking.find()
        .populate({path:"preferenceID"})
        .populate({path:"specialist"})
        .populate({path:"userID"})
        res.status(200).json({
            message: "success",
            count:data.length,
            data: data
        });

    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports.getbookingbystatus=async (req, res, next) => {
    const statusSearch = req.query.status 
    try {
        const data = await Booking.find({
            status:
                { $regex: `^${statusSearch}`, $options: 'i' } 
        }) 
        .populate({path:"preferenceID"})
        .populate({path:"specialist"})
        .populate({path:"userID"})
        res.status(200).json({ data });
    } catch (e) {
        console.log(e)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
    }
}


module.exports.cancelappointment = async (req, res) => {
    try {
        let updateid = await Booking.findById(req.params.id);
        if(updateid){
        const data={
            status:"Cancelled",  
        }
        datas=await Booking.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Appointment Cancelled",
            code:StatusCodes.OK,
            data:datas
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Appointment ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
module.exports.completedappointment = async (req, res) => {
    try {
        let updateid = await Booking.findById(req.params.id);
        if(updateid){
        const data={
            status:"Completed",  
        }
        datas=await Booking.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Appointment Completed",
            code:StatusCodes.OK,
            data:datas
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Appointment ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}














/* module.exports = router */