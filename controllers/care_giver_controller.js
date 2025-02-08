import mongoose from "mongoose";
import { CareGiver } from "../models/caregiver_model.js";
import { Patient } from "../models/patient_model.js";

export const getCareGiver = async (req,res) => {
    const logged = await req.user;
    console.log(logged);
    if (!logged) {
        return res.status(401).json({'message':'no logged user'});
    }
    if (logged.isPatient) {
        return res.status(401).json({'message':'patient found'});
    }
    try {
        const caregiverData = await CareGiver.findById(logged.id).select('id name profile_pic_url');
        if (!caregiverData) {
            return res.status(401).json({'message':'No data for caregiver'});
        }
        const patientData = await Patient.find({careGiver:logged.id}).select('id name profile_pic_url disability');
        const data = {
            'caregiverData':caregiverData,
            'patientData': patientData
        }
        return res.status(200).json({data});
    } catch (error) {
        return res.status(500).json({
            message : "Internal server occured",
            error : error.message
        });
    }
}