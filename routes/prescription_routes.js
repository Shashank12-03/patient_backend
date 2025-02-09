import { Router } from "express";
import { addPrescription, deletePrescription, getPrescriptions, getPrescriptionsByFilter } from "../controllers/prescription_controller.js";

export const prescriptionRoutes = Router();

prescriptionRoutes.post('/add-prescription',addPrescription);

prescriptionRoutes.get('/get-prescriptions-by-branch/:filter', getPrescriptionsByFilter);
prescriptionRoutes.get('/get-prescriptions',getPrescriptions);
prescriptionRoutes.delete('/delete-prescription/:id',deletePrescription);
// prescriptionRoutes.put('/update-prescription/:id',updatePrescription);
