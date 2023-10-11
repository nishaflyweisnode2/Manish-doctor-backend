const mongoose=require("mongoose");


const UsersAuthSchema=mongoose.Schema({
    firstname:{type:String},
    lastname:{type:String},
    phonenumber:{type:String},
    password:{type:String},
    userspicture:{type:String,default:null},
    cloudinary_id:{type:String,default:null}
},{timestamps:true})
module.exports=mongoose.model("User",UsersAuthSchema);