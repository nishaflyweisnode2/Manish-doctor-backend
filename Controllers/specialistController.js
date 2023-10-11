const { StatusCodes } = require("http-status-codes");
const { Specialist } = require("../Models/specialistModel");
const cloudinary=require("../utils/cloudinary")







module.exports.addspecialist = async (req, res) => {
    const {Specialistname}=req.body
    if(Specialistname==''){
        res.status(StatusCodes.BAD_REQUEST).json({
            status:"Failed",
            message:"Empty Field Not Accepted"
        })
    }else{
        const specialistfind=await Specialist.findOne({Specialistname})
         if(specialistfind){
             res.status(500).json({
                 status:"Failed",
                 message:"Specialist Exist"
             })
         }else{
             try{
                 const result=await cloudinary.uploader.upload(req.file.path)
                 const data= await new Specialist({
                    specialistimage:result.secure_url,
                    Specialistname: req.body.Specialistname,  
                    specialiseon: req.body.specialiseon,  
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

module.exports.editSpecialist = async (req, res) => {
   
    try {
        let updateid = await Specialist.findById(req.params.id);
       
        if(updateid){
            await cloudinary.uploader.destroy(updateid.cloudinary_id);
            const result=await cloudinary.uploader.upload(req.file.path);
        const data={
            specialistimage:result.secure_url || updateid.specialistimage,
            Specialistname: req.body.Specialistname || updateid.Specialistname,
            specialiseon: req.body.specialiseon || updateid.specialiseon,
            cloudinary_id:result.public_id || updateid.cloudinary_id
        };
        specialistdetails=await Specialist.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Specilist updated successfuly",
            code:StatusCodes.OK,
            data:specialistdetails
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Specialist ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
}


//DELETE
module.exports.deletespecialist = async (req, res) => {
    try {
        const specialistid=await Specialist.findByIdAndDelete(req.params.id)
        res.status(StatusCodes.OK).json({ message: "Specialist Deleted Successfully" })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Something Went Wrong" })
    }
};

//GET SINGLE Category BY USERS AND ADMIN
module.exports.getspecialistbyid =  async (req, res) => {
    try {
        const singleSpecialist = await Specialist.findById(req.params.id)
        if(singleSpecialist){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singleSpecialist
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Specialist ID"
            })
        }
        

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

//GET ALL CATEGPRIES
module.exports.getallspecialist =  async (req, res) => {
    try {
        const data = await Specialist.find();
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