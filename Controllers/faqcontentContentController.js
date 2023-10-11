const { StatusCodes } = require("http-status-codes");
const { Faqcontent } = require("../Models/faqcontentsModel");





module.exports.addfaqcontent = async (req, res) => {
    const {faqcontentname,faqid}=req.body
    if(faqcontentname=='' ||faqid=='' ){
        res.status(StatusCodes.BAD_REQUEST).json({
            status:"Failed",
            message:"Empty Field Not Accepted"
        })
    }else{
        const checkfaq=await Faqcontent.findOne({faqcontentname})
        if(!checkfaq){
            try{
                const data= await new Faqcontent({
                   faqcontentname:faqcontentname,
                   faqid:faqid
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
        }else{
            res.status(StatusCodes.CONFLICT).json({
                status:"Failed",
                message:"Faq Content Name Exist"
            })
        }
            
             
    }
}


//Edit Product code

module.exports.editcontentfaq = async (req, res) => {
    try {
        let updateid = await Faqcontent.findById(req.params.id);
        if(updateid){
        const data={
            faqcontentname:req.body.faqcontentname || updateid.faqcontentname,
            faqid:req.body.faqid || updateid.faqid
            
        };
        faqdetails=await Faqcontent.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Faq content updated successfuly",
            code:StatusCodes.OK,
            data:faqdetails
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Faq content ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}


//DELETE
module.exports.deletecontentfaq = async (req, res) => {
    try {
        const faqid=await Faqcontent.findByIdAndDelete(req.params.id)
        res.status(StatusCodes.OK).json({ message: "Faqcontent Deleted Successfully" })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Something Went Wrong" })
    }
};


module.exports.getsinglecontentfaq = async (req, res) => {
    try {
        const data=await Faqcontent.findById(req.params.id)
        .populate("faqid")
        if(data){
            res.status(StatusCodes.OK).json({ message: "success",data })
            
        }else{
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Invalid Faq ID",status:"Failed" })
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
};



//GET ALL CATEGPRIES
module.exports.getcontentbyfaqID =  async (req, res) => {
    const getcontentbyfaqid=req.params.faqid
    try {
        const data = await Faqcontent.find({faqid:getcontentbyfaqid})
        .populate("faqid")
        res.status(StatusCodes.OK).json({
            message:"success",
            count:data.length,
            data
        });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}


module.exports.getallfazcontent =  async (req, res) => {
    try {
        const data = await Faqcontent.find()
        .populate("faqid")
        res.status(StatusCodes.OK).json({
            message:"success",
            count:data.length,
            data
        });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

/* module.exports = router */