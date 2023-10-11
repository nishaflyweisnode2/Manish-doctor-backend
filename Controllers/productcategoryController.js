const { StatusCodes } = require("http-status-codes");
const { Productcategory } = require("../Models/productcategoryModel");
const cloudinary=require("../utils/cloudinary")







module.exports.addProductCat = async (req, res) => {
    const {productcatname}=req.body
    if(productcatname==''){
        res.status(StatusCodes.BAD_REQUEST).json({
            status:"Failed",
            message:"Empty Field Not Accepted"
        })
    }else{
        const Categoryfind=await Productcategory.findOne({productcatname})
         if(Categoryfind){
             res.status(500).json({
                 status:"Failed",
                 message:"Productcategory Exist"
             })
         }else{
             try{
                 const result=await cloudinary.uploader.upload(req.file.path)
                 const data= await new Productcategory({
                    productcatimage:result.secure_url,
                    productcatname: req.body.productcatname,  
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

module.exports.editCategory = async (req, res) => {
   
    try {
        let updateid = await Productcategory.findById(req.params.id);
       
        if(updateid){
            await cloudinary.uploader.destroy(updateid.cloudinary_id);
            const result=await cloudinary.uploader.upload(req.file.path);
       console.log(updateid)
        const data={

            productcatimage:result.secure_url || updateid.productcatimage,
            productcatname: req.body.productcatname || updateid.productcatname,
            cloudinary_id:result.public_id || updateid.cloudinary_id
        };
        categorydetails=await Productcategory.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Productcategory updated successfuly",
            code:StatusCodes.OK,
            data:categorydetails
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Productcategory ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


//DELETE
module.exports.deletecategory = async (req, res) => {
    try {
        await Productcategory.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Productcategory Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
};

//GET SINGLE Productcategory BY USERS AND ADMIN
module.exports.getcategorybyid =  async (req, res) => {
    try {
        const singleCategory = await Productcategory.findById(req.params.id)
        if(singleCategory){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singleCategory
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Productcategory ID"
            })
        }
        

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

//GET ALL CATEGPRIES
module.exports.getallcategory =  async (req, res) => {
    try {
        const data = await Productcategory.find();
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