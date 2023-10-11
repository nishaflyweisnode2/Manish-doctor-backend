const { StatusCodes } = require("http-status-codes");
const { Category } = require("../Models/category");
const cloudinary=require("../utils/cloudinary")







module.exports.addcategory = async (req, res) => {
    const {categoryname}=req.body
    if(categoryname==''){
        res.status(StatusCodes.BAD_REQUEST).json({
            status:"Failed",
            message:"Empty Field Not Accepted"
        })
    }else{
        const Categoryfind=await Category.findOne({categoryname})
         if(Categoryfind){
             res.status(500).json({
                 status:"Failed",
                 message:"Category Exist"
             })
         }else{
             try{
                 const result=await cloudinary.uploader.upload(req.file.path)
                 const data= await new Category({
                    categoryimage:result.secure_url,
                    categoryname: req.body.categoryname,  
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
        let updateid = await Category.findById(req.params.id);
       
        if(updateid){
            await cloudinary.uploader.destroy(updateid.cloudinary_id);
            const result=await cloudinary.uploader.upload(req.file.path);
       console.log(updateid)
        const data={

            categoryimage:result.secure_url || updateid.categoryimage,
            categoryname: req.body.categoryname || updateid.categoryname,
            cloudinary_id:result.public_id || updateid.cloudinary_id
        };
        categorydetails=await Category.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Category updated successfuly",
            code:StatusCodes.OK,
            data:categorydetails
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Category ID",
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
        const categoryid=await Category.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Category Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
};

//GET SINGLE Category BY USERS AND ADMIN
module.exports.getcategorybyid =  async (req, res) => {
    try {
        const singleCategory = await Category.findById(req.params.id)
        if(singleCategory){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singleCategory
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Category ID"
            })
        }
        

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

//GET ALL CATEGPRIES
module.exports.getallcategory =  async (req, res) => {
    try {
        const data = await Category.find();
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