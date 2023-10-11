const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
module.exports.Booking = model('Booking', Schema({
    Patientname: { type: String, required: true },
    dob: { type: String,required: true },
    mobile: { type: String,required: true },
    email: { type: String,required: true },
    streetno: { type: String,required: true },
    zipno: { type: String,required: true },
    landmark: { type: String,required: true },
    lng:{type:String,required: true},
    lat:{type:String,required: true},
    city: { type: String,required: true },
    state: { type: String,required: true },
    slot: { 
        type: String,
        enum:["Morning","Afternoon","Evening"],
        required:true
     },
    status: { 
        type: String,
        default:"Upcoming",
        enum:['Upcoming','Completed','Cancelled'],
        required:true
     },
     available:{
        type:String,
        enum:["1:00pm","2:00pm","4:00pm"],
        required:true
    },
     preferenceID:{type: mongoose.Schema.Types.ObjectId, ref:'Testpreference', index: true,required:true},
     userID:{type: mongoose.Schema.Types.ObjectId, ref:'User', index: true,required:true},
     specialist:{type:mongoose.Schema.Types.ObjectId, ref:'Specialist', index: true,required:true},
     fees:{type:Number}

    
}, { timestamps: true }));