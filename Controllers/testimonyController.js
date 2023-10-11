const { StatusCodes } = require("http-status-codes");
const { Testimony } = require("../Models/testimonyModel");
const cloudinary=require("../utils/cloudinary")







module.exports.addtestimony = async (req, res) => {
    const {testimonycontent}=req.body
    if(testimonycontent==''){
        res.status(StatusCodes.BAD_REQUEST).json({
            status:"Failed",
            message:"Empty Field Not Accepted"
        })
    }else{
        const Testimonyfind=await Testimony.findOne({testimonycontent})
         if(Testimonyfind){
             res.status(500).json({
                 status:"Failed",
                 message:"Testimony Exist"
             })
         }else{
             try{
                 const result=await cloudinary.uploader.upload(req.file.path)
                 const data= await new Testimony({
                    testimonyimage:result.secure_url,
                    testimonycontent: req.body.testimonycontent,  
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

module.exports.editTestimony = async (req, res) => {
   
    try {
        let updateid = await Testimony.findById(req.params.id);
       
        if(updateid){
            await cloudinary.uploader.destroy(updateid.cloudinary_id);
            const result=await cloudinary.uploader.upload(req.file.path);
       console.log(updateid)
        const data={

            testimonyimage:result.secure_url || updateid.testimonyimage,
            testimonycontent: req.body.testimonycontent || updateid.testimonycontent,
            cloudinary_id:result.public_id || updateid.cloudinary_id
        };
        testimonydetails=await Testimony.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Testimony updated successfuly",
            code:StatusCodes.OK,
            data:testimonydetails
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Testimony ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


//DELETE
module.exports.deletetestimony = async (req, res) => {
    try {
        await Testimony.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Testimony Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
};

//GET SINGLE Category BY USERS AND ADMIN


//GET ALL CATEGPRIES
module.exports.getalltestimony =  async (req, res) => {
    try {
        const data = await Testimony.find();
        res.status(200).json({
            message: "success",
            count:data.length,
            data: data
        });

    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports.getsingletestimony=async(req,res)=>{
    try {
        const serachbyid=await Testimony.findById(req.params.id)
        if(serachbyid){
            res.status(StatusCodes.OK).json({
                status:"success",
                data:serachbyid
            })
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error})
    }
}

/* module.exports = router */