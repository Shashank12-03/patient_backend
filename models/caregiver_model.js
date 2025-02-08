import mongoose from "mongoose";

const careGiverSchema = new mongoose.Schema({
    emailId :{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    profile_pic_url:{
        type:String
    },
    phone_number:{
        type:Number
    },
    list_of_patients:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:''
    },
    address:{
        type:String
    }
},{timestamps:true});

export const CareGiver = mongoose.model('CareGiver',careGiverSchema);
