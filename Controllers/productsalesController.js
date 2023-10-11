const { StatusCodes } = require("http-status-codes");
const Sellproduct  = require("../Models/productsalesModel");
const cloudinary=require("../utils/cloudinary")


module.exports.addsellproductcategory = async (req, res) => {
    const {title,content,description,facilities,subproductcategoryid,image}=req.body
    if(title=='' || content=='' || description=='' || facilities=='' || subproductcategoryid=='' || image==''){
        res.status(StatusCodes.BAD_REQUEST).json({
            status:"Failed",
            message:"Empty Field Not Accepted"
        })
    }else{
        const findproducttitle=await Sellproduct.findOne({title})
         if(findproducttitle){
             res.status(StatusCodes.CONFLICT).json({
                 status:"Failed",
                 message:"title Exist"
             })
         }else{
             try{
                 const result=await cloudinary.uploader.upload(req.file.path)
                 const data= await new Sellproduct({
                    image:result.secure_url,
                    title: req.body.title,  
                    content: req.body.content,  
                    description: req.body.description,  
                    facilities: req.body.facilities,  
                    doctors: req.body.doctors,  
                    rating: req.body.rating,  
                    subproductcategoryid: req.body.subproductcategoryid,
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

module.exports.editsellproduct = async (req, res) => {
   
    try {
        let updateid = await Sellproduct.findById(req.params.id);
       
        if(updateid){
            await cloudinary.uploader.destroy(updateid.cloudinary_id);
            const result=await cloudinary.uploader.upload(req.file.path);
       console.log(updateid)
        const data={
            image:result.secure_url || updateid.image,
            title: req.body.title || updateid.title,
            content: req.body.content || updateid.content,  
            description: req.body.description || updateid.description,  
            facilities: req.body.facilities || updateid.facilities,  
            doctors: req.body.doctors || updateid.doctors,  
            rating: req.body.rating || updateid.rating,  
            subproductcategoryid: req.body.subproductcategoryid || updateid.subproductcategoryid,
            cloudinary_id:result.public_id || updateid.cloudinary_id
        };
        products=await Sellproduct.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Product updated successfuly",
            code:StatusCodes.OK,
            data:products
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Product ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


//DELETE
module.exports.deleteproduct = async (req, res) => {
    try {
        const categoryid=await Sellproduct.findByIdAndDelete(req.params.id)
        if(categoryid){
            res.status(StatusCodes.OK).json({ message: "product Deleted Successfully"})
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Product ID"})
        }
        
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Something Went Wrong" })
    }
};

//GET SINGLE Category BY USERS AND ADMIN
module.exports.getsellproductbyid =  async (req, res) => {
    try {
        const singlesubCategory = await Sellproduct.findById(req.params.id)
        .populate("subproductcategoryid")
        .populate({path:"doctors"})
        //.populate({path:"productcategoryid"})
        if(singlesubCategory){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singlesubCategory
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Product ID"
            })
        }
        

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}
module.exports.getsubcategorybycategoryid =  async (req, res) => {
    const ids=req.params.subproductcategoryid
    try {
        const singleproduct = await Sellproduct.find({subproductcategoryid:ids})
        .populate("subproductcategoryid")
        .populate({path:"doctors"})
        if(singleproduct){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singleproduct
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Product ID"
            })
        }
        

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

//GET ALL CATEGPRIES
module.exports.getallsellproduct =  async (req, res) => {
    try {
        const data = await Sellproduct.find()
        .populate({path:"subproductcategoryid"})
        .populate({path:"doctors"})
        res.status(StatusCodes.OK).json({
            message: "success",
            count:data.length,
            data: data
        });

    } catch (error) {
        res.status(500).json(error)
    }
}

/* module.exports = router */