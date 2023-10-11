const { StatusCodes } = require("http-status-codes");
const { Faqs } = require("../Models/faqsModel");





module.exports.addfaqs = async (req, res) => {
    const {faq}=req.body
    if(faq==''){
        res.status(StatusCodes.BAD_REQUEST).json({
            status:"Failed",
            message:"Empty Field Not Accepted"
        })
    }else{
        const checkfaq=await Faqs.findOne({faq})
        if(!checkfaq){
            try{
                const data= await new Faqs({
                   faq:faq,
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
                message:"Faq Name Exist"
            })
        }
            
             
    }
}


//Edit Product code

module.exports.editfaq = async (req, res) => {
    try {
        let updateid = await Faqs.findById(req.params.id);
        if(updateid){
        const data={
            faq:req.body.faq || updateid.faq
        };
        faqdetails=await Faqs.findByIdAndUpdate(req.params.id, data, {new:true})
        res.status(StatusCodes.OK).json({
            message:"Faqs updated successfuly",
            code:StatusCodes.OK,
            data:faqdetails
        })
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({
                code:StatusCodes.BAD_REQUEST,
                status:"failed",
                message:"Invalid Faqs ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}


//DELETE
module.exports.deletefaq = async (req, res) => {
    try {
        const faqid=await Faqs.findByIdAndDelete(req.params.id)
        res.status(StatusCodes.OK).json({ message: "Faqs Deleted Successfully" })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Something Went Wrong" })
    }
};


module.exports.getsinglefaq = async (req, res) => {
    try {
        const fazid=await Faqs.findById(req.params.id)
        if(fazid){
            res.status(StatusCodes.OK).json({ message: "success",fazid })
        }else{
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Invalid Faq ID",status:"Failed" })
        }
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
};



//GET ALL CATEGPRIES
module.exports.getallfaz =  async (req, res) => {
    try {
        const data = await Faqs.find();
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