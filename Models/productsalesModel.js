const mongoose=require("mongoose");
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

const SellProductsSchema=mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    description:{type:String,required:true},
    facilities:[{type:String,required:true}],
    doctors:[{type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', index: true,default:null}],
    image:{type:String,required:true},
    rating:{type:SchemaTypes.Double, default:null},
    cloudinary_id:{type:String},
    subproductcategoryid:{type: mongoose.Schema.Types.ObjectId, ref: 'Subproductcategory', index: true,required:true}
})
module.exports=mongoose.model("Sellproduct",SellProductsSchema);