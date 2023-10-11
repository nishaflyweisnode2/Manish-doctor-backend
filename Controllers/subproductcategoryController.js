const { StatusCodes } = require("http-status-codes");
const Subproductcategory  = require("../Models/subproductcategoryModel");
const cloudinary=require("../utils/cloudinary")


module.exports.addsubproductcategory = async (req, res) => {
    const {subproductcategoryname,productcategoryid}=req.body
    if(subproductcategoryname=='' || productcategoryid==''){
        res.status(StatusCodes.BAD_REQUEST).json({
            status:"Failed",
            message:"Empty Field Not Accepted"
        })
    }else{
        const Categorysubfind=await Subproductcategory.findOne({subproductcategoryname})
         if(Categorysubfind){
             res.status(500).json({
                 status:"Failed",
                 message:"Sub Category Exist"
             })
         }else{
             try{
                 const result=await cloudinary.uploader.upload(req.file.path)
                 const data= await new Subproductcategory({
                    subproductcategoryimage:result.secure_url,
                    subproductcategoryname: req.body.subproductcategoryname,  
                    productcategoryid: req.body.productcategoryid,  
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

module.exports.editsubCategory = async (req, res) => {
   
    try {
        let updateid = await Subproductcategory.findById(req.params.id);
       
        if(updateid){
            await cloudinary.uploader.destroy(updateid.cloudinary_id);
            const result=await cloudinary.uploader.upload(req.file.path);
       console.log(updateid)
        const data={
            subproductcategoryimage:result.secure_url || updateid.subproductcategoryimage,
            productcategoryid:req.body.productcategoryid || updateid.productcategoryid,
            subproductcategoryname: req.body.subproductcategoryname || updateid.subproductcategoryname,
            cloudinary_id:result.public_id || updateid.cloudinary_id
        };
        categorydetails=await Subproductcategory.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Sub Category updated successfuly",
            code:StatusCodes.OK,
            data:categorydetails
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Sub Category ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


//DELETE
module.exports.deletesubcategory = async (req, res) => {
    try {
        const categoryid=await Subproductcategory.findByIdAndDelete(req.params.id)
        if(categoryid){
            res.status(StatusCodes.OK).json({ message: "Sub Category Deleted Successfully"})
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Sub Category ID"})
        }
        
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Something Went Wrong" })
    }
};

//GET SINGLE Category BY USERS AND ADMIN
module.exports.getsubcategorybyid =  async (req, res) => {
    try {
        const singlesubCategory = await Subproductcategory.findById(req.params.id)
        .populate("productcategoryid")
        if(singlesubCategory){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singlesubCategory
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Sub Category ID"
            })
        }
        

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}
module.exports.getsubcategorybycategoryid =  async (req, res) => {
    const ids=req.params.productcategoryid
    //const params=req.params.id
    try {
        const singlesubCategory = await Subproductcategory.find({productcategoryid:ids})
        .populate("productcategoryid")
        if(singlesubCategory){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singlesubCategory
            })
        }else{
            console.log(ids)
            console.log(singlesubCategory)
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
module.exports.getallsubcategory =  async (req, res) => {
    try {
        const data = await Subproductcategory.find()
        .populate({path:"productcategoryid"})
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