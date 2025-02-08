import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
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
    disability:{
        type:String,
    },
    dateOfBirth : {
        type : Date,
        required : true
    },
    gender : {
        type : String,
        enum : ['MALE', 'FEMALE', 'INTERSEX', 'TRANSGENDER(ASSIGNED MALE AT BIRTH)', 'TRANSGENDER(ASSIGNED FEMALE AT BIRTH)'],
        required : true
    },
    height : {                  //unit : cms
        type : Number,
        required : true 
    },
    weight : {                 //unit : kgs
        type : Number,
        required : true
    },
    medical_history : {
        type : {
            allergies: [{type : String}],
            pre_existing_conditions : [{type : String}]
        },
        default : {}
    },
    emergency_contacts : [
        {
            name : {type : String, required : true},
            contact : {type : Number, required : true},
            relation : {type : String, required : true}
        },
    ],
    careGiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CareGiver'
    },
    prescriptions:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Prescriptions'
    }
},{timestamps:true});

export const Patient = mongoose.model('Patient',PatientSchema);
