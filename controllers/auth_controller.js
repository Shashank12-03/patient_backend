import { Patient } from '../models/patient_model.js';
import { CareGiver } from '../models/caregiver_model.js';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
    const {email,password,isPatient} = req.body;
    if (!email || !password) {
        return res.status(401).json({'message':'email or password is missing'});
    }
    try{

        const email = req.body.email;
        const password = req.body.password;

        let user;
        let token;
        if (isPatient) {
            user = await Patient.findOne({
                emailId:email
            });
            if(!user){
                return res.status(409).json({
                    message : "An user with this email address already exists"
                });
            } 
            const doesMatch = bcrypt.compare(password, user.password);
            if(!doesMatch){
                return res.status(401).json({
                    message : "Password does not match the user with the email"
                });
            }
            token = jwt.sign({
                email : email,
                id : savedUser._id.toString(),
                isPatient : true 
            }, process.env.jwt_secret_key);
        }
        else{
            user = await CareGiver.findOne({
                emailId:email
            })
            if(!user){
                return res.status(409).json({
                    message : "An user with this email address already exists"
                });
            } 
            const doesMatch = bcrypt.compare(password, user.password);
            if(!doesMatch){
                return res.status(401).json({
                    message : "Password does not match the user with the email"
                });
            }
            token = jwt.sign({
                email : email,
                id : savedUser._id.toString(),
                isPatient : false 
            }, process.env.jwt_secret_key);
        }
        
        return res.status(200).json({
            message : "User logged in",
            token : token,
            name : user.name,
            profilePictureUrl : user.profile_pic_url
        });

    } catch (err) {
        return res.status(500).json({
            message : "Internal server occured",
            error : err.message
        });
    }
}

export const checkUserExists = async (req, res) => {
    const isPatient = req.body;
    
    try{
        const email = req.body.email;
        let user;
        if (isPatient) {
            user = await Patient.findOne({
                emailId:email
            });
        }
        else {
            user = await CareGiver.findOne({
                emailId:email
            })
        }
        if(user){
            return res.status(409).json({
                message : "An user with this email address already exists"
            });
        } 
        return res.status(200).json({
            message : "User for this email does not exist"
        });
    } catch (err){
        return res.status(500).json({
            message : "Internal server error occured",
            error : err.message
        });
    }
}

export const onboardPatient = async (req, res) => {

    const userData = req.body;
    if (!userData) {
        return res.status(401).json({'message':'userdata is needed to proceed further'})
    }
    try{

        const email = userData.email;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        const newUser = await Patient.create(userData);
        const token = jwt.sign({
            email : email,
            id : newUser._id.toString(),
            isPatient : true 
        }, process.env.jwt_secret_key);

        return res.status(200).json({
            message : "User logged in",
            token : token,
            name : newUser.name,
            isPatient : true, 
            profilePictureUrl : newUser.profile_picture
        });

    } catch (err) {
        return res.status(500).json({
            message : "Internal server error occured",
            error : err.message
        });
    }
}

export const onboardCareGiver = async (req, res) => {
    const userData = req.body;
    if (!userData) {
        return res.status(401).json({'message':'userdata is needed to proceed further'})
    }
    try{
        
        const email = userData.email;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        const newUser = new CareGiver(userData);
        const savedUser = await newUser.save();

        const token = jwt.sign({
            email : email,
            id : savedUser._id.toString(),
            isPatient : false 
        }, process.env.jwt_secret_key);

        return res.status(200).json({
            message : "User logged in",
            token : token,
            name : savedUser.name,
            isPatient : false, 
            profilePictureUrl : savedUser.profile_picture
        });

    } catch (err) {
        return res.status(500).json({
            message : "Internal server error occured",
            error : err.message
        });
    }
}