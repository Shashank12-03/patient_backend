import { Router } from "express";
import { checkUserExists, loginUser, onboardCareGiver, onboardPatient } from "../controllers/auth_controller.js";

export const authRoutes = Router();

authRoutes.post('/add-patient',onboardPatient);
authRoutes.post('/add-caregiver',onboardCareGiver);
authRoutes.get('/check-user-exists',checkUserExists);
authRoutes.post('/login-user',loginUser);