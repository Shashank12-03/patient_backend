import mongoose from "mongoose";


const prescriptionsSchema = new  mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    addedByPatient:{
        type:Boolean
    },
    branch: {
        type: String,
        enum: [
            "General Practitioner (Manages overall health)",
            "Cardiologist (Heart specialist)",
            "Neurologist (Brain and nervous system specialist)",
            "Endocrinologist (Hormonal disorders specialist)",
            "Orthopedic Surgeon (Bone and joint specialist)",
            "Dermatologist (Skin, hair, and nail specialist)",
            "Gynecologist (Female reproductive health specialist)",
            "Psychiatrist (Mental health specialist)",
            "Pulmonologist (Lung and respiratory specialist)",
            "Oncologist (Cancer specialist)",
            "Others"
        ],
        required: true
    },
    doctor_detail: {
        doctor_name:{ 
            type: String, 
            required: true 
        },
        doctor_id:{
            type:mongoose.Schema.Types.ObjectId
        }
    },
    disease: { 
        type: String, 
        required: true 
    },
    description :{
        type: String
    },
    date_of_visit: {
        type: Date,
        required : true
    },
    prescription: { 
        type: String,
        require:true 
    },
    supporting_documents: [{ 
        type: String 
    }]

},{timestamps:true});

export const Prescriptions = mongoose.model('Prescriptions',prescriptionsSchema);  