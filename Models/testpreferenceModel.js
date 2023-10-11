const mongoose=require("mongoose");


const TestPreferenceSchema=mongoose.Schema({
    preferencename:{type:String,required:true},
    preferenceimage:{type:String,required:true},
    preferenceprice:{type:Number,required:true},
    cloudinary_id:{type:String},
    testID:{type: mongoose.Schema.Types.ObjectId, ref: 'Testhealth', index: true,required:true}
},{timestamps:true})
module.exports=mongoose.model("Testpreference",TestPreferenceSchema);