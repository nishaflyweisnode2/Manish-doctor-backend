const mongoose=require("mongoose");


const SubproductcategorySchema=mongoose.Schema({
    subproductcategoryname:{type:String,required:true},
    subproductcategoryimage:{type:String,required:true},
    cloudinary_id:{type:String},
    productcategoryid:{type: mongoose.Schema.Types.ObjectId, ref: 'Productcategory', index: true,required:true}
})
module.exports=mongoose.model("Subproductcategory",SubproductcategorySchema);