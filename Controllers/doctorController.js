const { StatusCodes } = require("http-status-codes");
const { Doctor } = require("../Models/doctorModel");
const cloudinary=require("../utils/cloudinary")

module.exports.addDoctor = async (req, res) => {
    const {doctorname,yearexperience,content,phonenumber,email}=req.body
    if(doctorname=='' || yearexperience=='' || content=='' || phonenumber=='' || email==''){
        res.status(StatusCodes.BAD_REQUEST).json({
            status:"Failed",
            message:"Empty Field Not Accepted"
        })
    }else{
        const Categoryfind=await Doctor.findOne({doctorname})
         if(Categoryfind){
             res.status(500).json({
                 status:"Failed",
                 message:"Doctor Exist"
             })
         }else{
             try{
                 const result=await cloudinary.uploader.upload(req.file.path)
                 const data= await new Doctor({
                    doctorspicture:result.secure_url,
                    doctorname: req.body.doctorname,  
                    yearexperience: req.body.yearexperience,  
                    rating: req.body.rating,  
                    content: req.body.content,  
                    phonenumber: req.body.phonenumber,  
                    email: req.body.email,  
                    cloudinary_id:result.public_id
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

module.exports.editDoctor = async (req, res) => {
   
    try {
        let updateid = await Doctor.findById(req.params.id);
       
        if(updateid){
            await cloudinary.uploader.destroy(updateid.cloudinary_id);
            const result=await cloudinary.uploader.upload(req.file.path);
        const data={

            doctorspicture:result.secure_url || updateid.doctorspicture,
            doctorname: req.body.doctorname || updateid.doctorname,  
            yearexperience: req.body.yearexperience || updateid.yearexperience, 
            rating: req.body.rating || updateid.rating,  
            content: req.body.content || updateid.content,  
            phonenumber: req.body.phonenumber || updateid.phonenumber,  
            email: req.body.email || updateid.email,  
            cloudinary_id:result.public_id || updateid.cloudinary_id
        };
        Doctorsdetails=await Doctor.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Doctor updated successfuly",
            code:StatusCodes.OK,
            data:Doctorsdetails
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Doctor ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


//DELETE
module.exports.deleteDoctor = async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Doctor Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
};

//GET SINGLE Doctor BY USERS AND ADMIN
module.exports.getdoctorbyid =  async (req, res) => {
    try {
        const singleDoctor = await Doctor.findById(req.params.id)
        if(singleDoctor){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singleDoctor
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Doctor ID"
            })
        }
        

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

//GET ALL CATEGPRIES
module.exports.getallDoctor =  async (req, res) => {
    try {
        const data = await Doctor.find();
        res.status(200).json({
            message: "success",
            count:data.length,
            data: data
        });

    } catch (error) {
        res.status(500).json(error)
    }
}

/* module.exports = router */