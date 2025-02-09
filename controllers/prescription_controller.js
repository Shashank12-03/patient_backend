import { Prescriptions } from "../models/prescriptions_model.js";

import { Patient } from "../models/patient_model.js";

export const addPrescription = async (req,res) => {

    const loggedUser = await req.user;

    if (!loggedUser) {
        return res.status(401).json({'message':'No login user found'});
    }
    
    try {

        const { patientId, branch, doctor_name, disease, description, date_of_visit, prescription, supporting_documents } = req.body;

        if (!branch || !doctor_name || !disease || !prescription) {
            return res.status(400).json({ message: 'Missing required fields: branch, doctor_name, disease, prescription' });
        }

        const token = req.headers.authorization?.split(' ')[1];

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
            // Fetch doctor details
        const doctorApiUrl = `http://127.0.0.1:8000/doctor/search-doctor/search?doctor_name=${doctor_name}`;
        const response = await fetch(doctorApiUrl, { method: "GET", headers });

        if (!response.ok) {
            throw new Error(`Doctor API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(data);
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const doctorList = data.doctorList;
        // Extract relevant doctor details
        const doctor_detail = {
            doctor_id: doctorList[0]._id,  // Store only necessary fields
            doctor_name: doctorList[0].name,
        };
        console.log(doctor_detail);
        // Store prescription
        const newPrescription = await Prescriptions.create({
            patient: patientId,
            branch,
            doctor_detail,  // Now correctly formatted
            disease,
            description,
            date_of_visit,
            prescription,
            supporting_documents
        });
        
        // Response object
        const sendPrescription = {
            disease: newPrescription.disease,
            description: newPrescription.description,
            doctor_name: newPrescription.doctor_detail.name,  // Fixed this
            date_of_visit: newPrescription.date_of_visit,
            branch: newPrescription.branch,
            prescription: newPrescription.prescription,
            supporting_documents: newPrescription.supporting_documents
        };
        const updateUser = await Patient.findByIdAndUpdate(patientId,{$push:{prescriptions:newPrescription.id}},{new:true});
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
        const userPrescriptions = await Prescriptions.find({user:loggedUser.id}).populate({ path: "patient", select: "name profile_pic_url" });
        // const userPrescription = 
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
