const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const otpGenerator = require('otp-generator');
const {Otp} = require('../Models/otpModel');
const cloudinary=require("../utils/cloudinary")
const asyncRapper=require("../Middlewares/asyncRapper")
const userModel=require("../Models/usersAuthModel")
const {StatusCodes}=require("http-status-codes");





module.exports.signUp = async (req, res) => {
    const {firstname,lastname,phonenumber,password} = req.body
    try{
            if (firstname == '' || lastname == '' || phonenumber == '' || password == '') {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: "Failed",
                    message: "Empty Input Fields!"
                })
            }else{
            const checkmobile= await userModel.findOne({ phonenumber })
           
             if(checkmobile){
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                    {
                        code:500,
                        message: "User Already Exist"
                    }
                );
             }else{
                let findUser = await userModel.findOne({phonenumber});
                const saltRounds =await bcrypt.genSalt(10);
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const data = new userModel({
                        firstname,
                        lastname,
                        phonenumber,
                        password:hashedPassword,
                     
                    });
                const accessToken = jwt.sign({
                    id: data.id,
                    phonenumber:req.body.phonenumber,
                    firstname:req.body.firstname,
                    lastname:req.body.lastname
                }, process.env.SECRETK, { expiresIn: "1d" });
                sendData=data.save()
                if(sendData){
                    res.status(StatusCodes.CREATED).json({
                        code:StatusCodes.CREATED,
                        Status: "success",
                        message: "User Registered Successfully",
                        accesstoken:accessToken,
                        data   
                    })
                }
             })
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
           
            
        


module.exports.login = async (req, res) => {
    const { phonenumber } = req.body
    if(phonenumber==''){
        return res.status(401).json("Empty Field not Allowed");
    }else{
        try {
            const checkuser = await userModel.findOne({ phonenumber })
        if (checkuser) {
                const saltRounds = 10
                const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false });
                const otp = new Otp({ phonenumber: phonenumber, otp: OTP });
                const salt =await bcrypt.genSalt(saltRounds);
                otp.otp = await bcrypt.hash(otp.otp, salt);
                await otp.save(); 
                const data={
                    phonenumber: req.body.phonenumber || checkuser.phonenumber,
                };
                const accessToken = jwt.sign({
                    id: checkuser._id,
                    phonenumber:req.body.phonenumber,
                    firstname:req.body.firstname,
                    lastname:req.body.lastname
                }, process.env.SECRETK, { expiresIn: "1d" });
                updateer=await userModel.findByIdAndUpdate(req.params.id, data, {new:true})
                res.status(200).json({
                    accessToken,
                    otp: OTP
                })
        }else{
            res.status(401).json({
                stutus:"failed",
                message:"You are not a registered User"
            })
    
        }
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }  
    }  
}


module.exports.verifyOtp = async (req, res) => {
    const { phonenumber } = req.body
    try {
        const checkusers = await userModel.findOne({ phonenumber })
    if (checkusers) {
        const otpHolder = await Otp.find({
            phonenumber: req.body.phonenumber
        });
        if (otpHolder.length === 0)
            return res.status(400).json("Expired OTP or Your Number Doesnt Correspond with This Token");
        const rightOtpFind = otpHolder[otpHolder.length - 1];
        const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp)

        if (rightOtpFind.phonenumber === req.body.phonenumber && validUser) {
            const accessToken = jwt.sign({
                id: checkusers.id,
                phonenumber:checkusers.phonenumber
                
            }, process.env.SECRETK, { expiresIn: "30d" });
            await Otp.deleteMany({
                phonenumber: rightOtpFind.phonenumber
            });
            return res.status(200).send({
                message: "login Successful",
                token: accessToken,
                data: {
                    "phonenumber": phonenumber,
                    "id": checkusers._id,
                }    
            })
            
        } else {
            return res.status(400).json({success:false,message:"OTP was wrong",status:400})
        }
    }else{
        res.status(500).json(error)
    }
    } catch (error) {
        res.status(500).json(error)
    }    
}











module.exports.getallusers=async(req,res)=>{
    try {
        const data=await userModel.find()
        if(data){
            res.status(StatusCodes.OK).json({
                message:"success",
                status:StatusCodes.OK,
                countusers:data.length,
                data
                
            })
        }else{
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message:"Something Went Wrong",
                status:StatusCodes.INTERNAL_SERVER_ERROR
            })
        }
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:"Something Wrong",
            status:"Failed"
        })
    }
}
module.exports.getuserprofile=async(req,res)=>{
    try{
        const data=await userModel.findOne({_id:req.user.id})
        //.populate({path:"userId"});
        res.status(200).json({
            message:"success",
            status:200,
            data
        })
    }
    catch(error){
        res.status(200).json({
           message:error
        })
    }
}


module.exports.updateusersprofile=async(req,res)=>{
    try {
        let updateuser = await userModel.findById(req.params.id);
        //await cloudinary.uploader.destroy(updateuser.cloudinary_id);
        const result=await cloudinary.uploader.upload(req.file.path);
        const data={
            userspicture:result.secure_url || updateuser.userspicture,
            firstname: req.body.firstname || updateuser.firstname,
            lastname: req.body.lastname || updateuser.lastname,
            phonenumber: req.body.phonenumber || updateuser.phonenumber,
            cloudinary_id:result.public_id || updateuser.cloudinary_id
        };
        updateer=await userModel.findByIdAndUpdate(req.user.id, data, {new:true})
        res.status(200).json({
            message:"user profile updated successfuly",
            code:200,
            data:updateer
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
} 