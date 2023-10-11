const { StatusCodes } = require("http-status-codes");
const { Testhealth } = require("../Models/testhealthModel");
const Testpreference  = require("../Models/testpreferenceModel");
const cloudinary=require("../utils/cloudinary")


module.exports.addpreference = async (req, res) => {
    const {preferencename,preferenceprice,testID}=req.body
    if(preferencename=='' || testID=='' || preferenceprice==''){
        res.status(StatusCodes.BAD_REQUEST).json({
            status:"Failed",
            message:"Empty Field Not Accepted"
        })
    }else{
        const check=await Testpreference.findOne({preferencename})
         if(check){
             res.status(StatusCodes.CONFLICT).json({
                 status:"Failed",
                 message:"Preference Exist"
             })
         }else{
            const idcheck=await Testhealth.findOne({_id:testID})
            try{
                 const result=await cloudinary.uploader.upload(req.file.path)
                 const data= await new Testpreference({
                    preferenceimage:result.secure_url,
                    preferencename: req.body.preferencename,  
                    preferenceprice:idcheck.testprice,  
                    testID: req.body.testID,  
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

module.exports.editpreference = async (req, res) => {
   
    try {
        let updateid = await Testpreference.findById(req.params.id);
        const {testID}=req.body
        const idcheck=await Testhealth.findOne({_id:testID})
        if(updateid){
            await cloudinary.uploader.destroy(updateid.cloudinary_id);
            const result=await cloudinary.uploader.upload(req.file.path);
       console.log(idcheck)
        const data={
            preferenceimage:result.secure_url || updateid.preferenceimage,
            testID:req.body.testID || updateid.testID,
            preferenceprice:idcheck.testprice || updateid.preferenceprice,
            preferencename: req.body.preferencename || updateid.preferencename,
            cloudinary_id:result.public_id || updateid.cloudinary_id
        };
        datas=await Testpreference.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Preference updated successfuly",
            code:StatusCodes.OK,
            data:datas
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid preference ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


//DELETE
module.exports.deletepreference = async (req, res) => {
    try {
        const preferenceid=await Testpreference.findByIdAndDelete(req.params.id)
        if(preferenceid){
            res.status(StatusCodes.OK).json({ message: "preference Deleted Successfully"})
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Preference ID"})
        }
        
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Something Went Wrong" })
    }
};

//GET SINGLE Category BY USERS AND ADMIN
module.exports.getpreferencebyid =  async (req, res) => {
    try {
        const singleprefrence = await Testpreference.findById(req.params.id)
        .populate("testID")
        if(singleprefrence){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singleprefrence
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Preference ID"
            })
        }
        

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}
module.exports.getpreferencebytestid =  async (req, res) => {
    const ids=req.params.testID
    //const params=req.params.id
    try {
        const singlepreference = await Testpreference.find({testID:ids})
        .populate("testID")
        if(singlepreference){
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singlepreference
            })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Preference ID"
            })
        }
        

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

//GET ALL CATEGPRIES
module.exports.getallpreference =  async (req, res) => {
    try {
        const data = await Testpreference.find()
        .populate({path:"testID"})
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