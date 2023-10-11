const { AdminAuth } = require("../Models/adminauthModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const asyncRapper=require("../Middlewares/asyncRapper");

module.exports.adminregistration = asyncRapper(async (req, res) => {
    const { email,fullname,number,password } = req.body
    if (fullname == '' || email == '' || password == '' || number=='') {
        res.status(500).json({
            status: "Failed",
            message: "Empty Input Fields!"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.status(500).json({
            status: "Failed",
            message: "Invalid Email Name"
        })
    } else if (password.length < 8) {
        res.status(500).json({
            status: "Failed",
            message: "Password is too short"
        })
    } else {

    const CheckEmail= await AdminAuth.findOne({email});
    if(!CheckEmail){
        const newAdmin = await new AdminAuth({
            fullname,
            number,
            email,
            verified:true,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORDECRPY).toString(),
        })
        const accessToken = jwt.sign({
            id: newAdmin._id,
            isAdmin: newAdmin.isAdmin
        }, process.env.SECRETK, { expiresIn: "1d" });
            newAdmin.save();
            res.status(201).json({
                message: "Success",
                data: {newAdmin,accessToken}
            })
    }else{
        res.status(500).json({
            status:"Failed",
            message:"Admin Already Exist"
        })
    } 
}
})

      




 module.exports.authlogin =asyncRapper(async (req, res) => {
    let { email, password } = req.body
    if (email == '' || password == '') {
        res.status(500).json({
            Status: "Failed",
            message: "Empty Credentials Supplied!"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.status(401).json({
            status: "Failed",
            message: "Invalid Email Name"
        })
    } else if (password.length < 8) {
        res.status(500).json({
            status: "Failed",
            message: "Password Too Small"
        })
    } else {
        const user = await AdminAuth.findOne({ email: email})
        if(user){
            const hashedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASSWORDECRPY
            );
            const originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);
            if(originalpassword !== req.body.password){
                res.status(500).json({
                    status: "Failed",
                    message: "Invalid Password"
                })
            }else{
                const accessToken = jwt.sign({
                    id: user._id,
                    isAdmin: user.isAdmin
                }, process.env.SECRETK, { expiresIn: "1d" });
        
                const { password, ...others } = user._doc;
                res.status(200).json({
                    message: "You have successfully Logged in",
                    data: { ...others, accessToken }
                })
            }
        }else{
            res.status(500).json({
                status: "Failed",
                message: "Invalid Email"
            })
        }
   
} 
 })