
const asyncRapper=require("../Middlewares/asyncRapper")
const Product=require("../Models/productModel")
const {StatusCodes}=require("http-status-codes");




module.exports.Addproducts = async (req, res) => {
    const {producttitle,oldprice,currentprice,availability,includetest,description,sampletest,fastingrequired,subcategory} = req.body
    try{
            if (producttitle == '' || oldprice == '' || currentprice == '' || availability == '' || includetest=='' || description=='' || sampletest=='' || fastingrequired=='' || subcategory=='') {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: "Failed",
                    message: "Empty Input Fields!"
                })
            }else{
            const checkproduct= await Product.findOne({producttitle})
             if(checkproduct){
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                    {
                        code:500,
                        message: "Product Already Exist"
                    }
                );
             }else{      
                
                    const percentage=currentprice/oldprice*100;
                    const rounded=percentage.toFixed(2)
                    const data = new Product({
                        producttitle,
                        oldprice,
                        currentprice,
                        availability,
                        includetest,
                        description,
                        sampletest,
                        fastingrequired,
                        subcategory,
                        percentageoff:rounded
                     
                    });
                sendData=data.save()
                if(sendData){
                    console.log(percentage)
                    res.status(StatusCodes.CREATED).json({
                        code:StatusCodes.CREATED,
                        Status: "success",
                        message: "Product Added",
                        data   
                    })
                }
             
             }
            }

        }
            catch(error){
                console.log(error)
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    error  
                })
            }
        }
        

        module.exports.getallProducts =  async (req, res) => {
            try {
                const data = await Product.find()
                .populate({path:"subcategory"})
                res.status(200).json({
                    message: "success",
                    count:data.length,
                    data: data
                });
        
            } catch (error) {
                res.status(500).json(error)
            }
        }


        module.exports.getproductbyid =  async (req, res) => {
            try {
                const singleProduct = await Product.findById(req.params.id)
                .populate({path:"subcategory"})
                if(singleProduct){
                    res.status(StatusCodes.OK).json({
                        message: "success",
                        data: singleProduct
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



        module.exports.getproductbysubcategoryid =  async (req, res) => {
            const params=req.params.subcategory
            try {
                const singleProduct = await Product.find({subcategory:params})
                //.populate({path:"subcategory"})
                if(singleProduct){
                    res.status(StatusCodes.OK).json({
                        message: "success",
                        data: singleProduct
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



        module.exports.deleteProduct = async (req, res) => {
            try {
                await Product.findByIdAndDelete(req.params.id)
                res.status(200).json({ message: "Product Deleted Successfully" })
            } catch (err) {
                res.status(500).json({ error: "Something Went Wrong" })
            }
        }


        module.exports.editproduct = async (req, res) => {
            const {oldprice,currentprice} = req.body
            try {
                let updateid = await Product.findById(req.params.id);
               const prices=currentprice/oldprice*100;
               const rounded=prices.toFixed(2)
                if(updateid){
                const data={
                    producttitle:req.body.producttitle || updateid.producttitle,
                    oldprice:req.body.oldprice || updateid.oldprice,
                    currentprice:req.body.currentprice || updateid.currentprice,
                    availability:req.body.availability || updateid.availability,
                    includetest:req.body.includetest || updateid.includetest,
                    description:req.body.description || updateid.description,
                    sampletest:req.body.sampletest || updateid.sampletest,
                    fastingrequired:req.body.fastingrequired || updateid.fastingrequired,
                    subcategory:req.body.subcategory || updateid.subcategory,
                    percentageoff:rounded || updateid.percentageoff 
                };
               
                Productdetails=await Product.findByIdAndUpdate(req.params.id, data, {new:true})
                res.status(StatusCodes.OK).json({
                    message:"Product updated successfuly",
                    code:StatusCodes.OK,
                    data:Productdetails
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

        module.exports.searchProducts=async (req, res, next) => {
            const producttitleSearch = req.query.producttitle 
            try {
                const data = await Product.find({
                    producttitle:
                        { $regex: `^${producttitleSearch}`, $options: 'i' } 
                });
                res.status(200).json({ data });
            } catch (e) {
                console.log(e)
                res.status(500).end()
            }
        }