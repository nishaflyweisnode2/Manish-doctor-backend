const mongoose=require("mongoose");
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

const ProductSchema=mongoose.Schema({
    producttitle:{type:String,required:true},
    oldprice:{type:SchemaTypes.Double,required:true},
    currentprice:{type:SchemaTypes.Double,required:true},
    availability:{type:String,required:true},
    includetest:[{type:String,required:true}],
    description:{type:String,required:true},
    sampletest:{type:String,required:true},
    fastingrequired:{type:String,required:true},
    percentageoff:{type:String,required:true},
    subcategory:{type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', index: true,required:true}
})
module.exports=mongoose.model("Product",ProductSchema);