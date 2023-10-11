const { StatusCodes } = require("http-status-codes");
const { Healthcategory } = require("../Models/heathCategoryModel");
const cloudinary=require("../utils/cloudinary")







module.exports.addhealthcategory = async (req, res) => {
    const {healthcategoryname}=req.body
    if(healthcategoryname==''){
        res.status(StatusCodes.BAD_REQUEST).json({
            status:"Failed",
            message:"Empty Field Not Accepted"
        })
    }else{
        const Categoryfind=await Healthcategory.findOne({healthcategoryname})
         if(Categoryfind){
             res.status(500).json({
                 status:"Failed",
                 message:"Healthcategory Exist"
             })
         }else{
             try{
                 const result=await cloudinary.uploader.upload(req.file.path)
                 const data= await new Healthcategory({
                    healthcategoryimage:result.secure_url,
                    healthcategoryname: req.body.healthcategoryname,  
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

module.exports.edithealthCategory = async (req, res) => {
   
    try {
        let updateid = await Healthcategory.findById(req.params.id);
       
        if(updateid){
            await cloudinary.uploader.destroy(updateid.cloudinary_id);
            const result=await cloudinary.uploader.upload(req.file.path);
       console.log(updateid)
        const data={

            healthcategoryimage:result.secure_url || updateid.healthcategoryimage,
            healthcategoryname: req.body.healthcategoryname || updateid.healthcategoryname,
            cloudinary_id:result.public_id || updateid.cloudinary_id
        };
        categorydetails=await Healthcategory.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Healthcategory updated successfuly",
            code:StatusCodes.OK,
            data:categorydetails
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Healthcategory ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


//DELETE
module.exports.deletehealthcategory = async (req, res) => {
    try {
        const categoryid=await Healthcategory.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Healthcategory Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
};

//GET SINGLE Healthcategory BY USERS AND ADMIN
module.exports.gethealthcategorybyid =  async (req, res) => {
    try {
        const singleCategory = await Healthcategory.findById(req.params.id)
        if(singleCategory){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singleCategory
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Healthcategory ID"
            })
        }
        

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

//GET ALL CATEGPRIES
module.exports.getallhealthcategory =  async (req, res) => {
    try {
        const data = await Healthcategory.find();
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