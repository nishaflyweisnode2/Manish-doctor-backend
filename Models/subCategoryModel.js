const mongoose=require("mongoose");


const SubcategorySchema=mongoose.Schema({
    subcategoryname:{type:String,required:true},
    subcategoryimage:{type:String,required:true},
    cloudinary_id:{type:String},
    categoryid:{type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true,required:true}
},{timestamps:true})
module.exports=mongoose.model("Subcategory",SubcategorySchema);