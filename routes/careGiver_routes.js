import { Router } from "express";
import { getCareGiver } from "../controllers/care_giver_controller.js";

export const careGiverRoutes = Router();

careGiverRoutes.get('/get-caregiver-data',getCareGiver);