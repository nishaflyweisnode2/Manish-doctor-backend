const mongoose=require("mongoose");


const { Schema, model } = require("mongoose");
module.exports.Testhealth = model('Testhealth', Schema({
    testtitle:{type:String,required:true},
    testcontent:{type:String,required:true},
    testimage:{type:String,required:true},
    hour:{type:String,required:true},
    collections:{type:String,required:true},
    cloudinary_id:{type:String},
    testprice:{type:Number,required:true},
    status:{
        type:String,
        enum:['Limited Time','Not Limited Time'],
        default:"Not Limited Time",
    },
    healthtestcategoryid:{type: mongoose.Schema.Types.ObjectId,ref:"Healthcategory",index: true,required:true}
}, { timestamps: true }));
/* const mongoose=require("mongoose");


const TesthealthSchema=mongoose.Schema({
    testtitle:{type:String,required:true},
    testcontent:{type:String,required:true},
    testimage:{type:String,required:true},
    hour:{type:String,required:true},
    collection:{type:String,required:true},
    cloudinary_id:{type:String},
    healthtestcategoryid:{type: mongoose.Schema.Types.ObjectId,ref:"Healthcategory",index: true,required:true}
},{timestamps:true})
module.exports=mongoose.model("Testhealth", TesthealthSchema); */