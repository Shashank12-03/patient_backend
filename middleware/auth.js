import { getUser } from "../services/auth.js";


export const checkAuthentication = async (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({'message':'token required'});
    }
    const user = await getUser(token);
    req.user = null;
    if (!user) {
        return res.status(401).json({'message':'user not found'})
    }
    req.user = user;
    next();
};