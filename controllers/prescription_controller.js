import { Prescriptions } from "../models/prescriptions_model.js";
import User from "../models/user_model.js";
import { getUserbyId } from "../services/getUser.js";
import mongoose from "mongoose";

export const addPrescription = async (req,res) => {

    const loggedUser = await req.user;

    if (!loggedUser) {
        return res.status(401).json({'message':'No login user found'});
    }
    
    try {

        const {branch, doctor_detail, disease, description, date_of_visit, prescription, supporting_documents} = req.body;
        if (!branch || !doctor_detail || !disease || !prescription) {
            return res.status(400).json({'message':'Either of branch, doctor name, disease, prescriptions url is missing'});
        }
        
        const newPrescription = await Prescriptions.create({
            patient:loggedUser.id,
            branch,
            doctor_detail,
            disease,
            description,
            date_of_visit,
            prescription,
            supporting_documents
        });
        const sendPrescription = {
            'disease' : newPrescription.disease,
            'description' : newPrescription.description,
            'doctor_name' : newPrescription.doctor_name,
            'date_of_visit' : newPrescription.date_of_visit,
            'branch' : newPrescription.branch,
            'prescription' : newPrescription.prescription,
            'supporting_documents' : newPrescription.supporting_documents
        };
        const updateUser = await User.findByIdAndUpdate(loggedUser.id,{$push:{prescriptions:newPrescription.id}},{new:true});
        return res.status(201).json({'message':'New Prescription created', 'prescription' : sendPrescription});

    } catch (error) {
        return res.status(500).json({
            message : "Internal server occured",
            error : error.message
        });
    }
};

export const getPrescriptionsByFilter = async (req,res) => {
    const loggedUser = await req.user;
    if (!loggedUser) {
        return res.status(401).json({'message':'No login user found'});
    }
    const filter = req.params.filter;
    console.log(filter);
    if (!filter) {
        return res.status(404).json({'message':'branch not found'});
    }
    try {

        const prescriptionByFilter = await Prescriptions.find({user:loggedUser.id,$or:[{doctor_name:filter}, {branch:filter}, {disease:filter}]});
        console.log(prescriptionByFilter);
        if (!prescriptionByFilter) {
            return res.status(400).json({'message':`No data exist for the filter ${filter}`});
        }
        return res.status(200).json({'message':'For filter these are the prescriptions',prescriptionByFilter});

    } catch (error) {
        return res.status(500).json({
            message : "Internal server occured",
            error : error.message
        });
    }
}

export const getPrescriptions = async (req,res) => {
    const loggedUser = await req.user;
    if (!loggedUser) {
        return res.status(401).json({'message':'No login user found'});
    }

    try {
        const userPrescriptions = await Prescriptions.find({user:loggedUser.id});
        if (!userPrescriptions) {

            return res.status(400).json({'message':`No data exist`});
        }

        return res.status(200).json({'message':'For user this are the prescriptions',userPrescriptions});

    } catch (error) {
        return res.status(500).json({
            message : "Internal server occured",
            error : error.message
        });
    }
}

export const deletePrescription = async (req,res) => {
    const loggedUser = await req.user;
    if (!loggedUser) {
        return res.status(401).json({'message':'No login user found'});
    }
    const id = req.params.id;
    if (!id) {
        return res.status(404).json({'message':'id not found'});
    }
    try {
        const deletedPrescriptions = await Prescriptions.findByIdAndDelete(id);
        console.log(deletedPrescriptions);
        if (!deletedPrescriptions) {
            return res.status(404).json({'message':'No prescription found for the given id'});
        }
        await User.findByIdAndUpdate(loggedUser.id,{$pull:{prescriptions:id}});
        return res.status(200).json({'message':'Prescription deleted'});
    } catch (error) {
        return res.status(500).json({
            message : "Internal server occured",
            error : error.message
        });
    }
}

// export const updatePrescription = async (req,res) => {
//     const loggedUser = await req.user;
//     if (!loggedUser) {
//         return res.status(401).json({'message':'No login user found'});
//     }
//     const id = req.params.id;
//     if (!id) {
//         return res.status(404).json({'message':'id not found'});
//     }
//     // const updateInfo = 
//     try {
//         const objectId = new mongoose.Types.ObjectId(id);
//         const prescription = await Prescriptions.findOne({user:loggedUser.id,"detail_information._id":objectId});
//         const info = prescription.detail_information[0];
//         const updatePrescription = await Prescriptions.updateOne({user:loggedUser.id,"detail_information._id":objectId},{$set:{"detail_information.$._id":updateInfo}});
        
//         return res.status(200).json({'message':'prscription',info});

//     } catch (error) {
//         return res.status(500).json({
//             message : "Internal server occured",
//             error : error.message
//         });
//     }
// }