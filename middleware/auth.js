import { getUser } from "../services/auth.js";

export const secret = process.env.secret;

export const checkAuthentication = async (req,res,next) => {
    const token = req.headers.authorization?.split('')[1];
    if (!token) {
        return res.status(401).json({'message':'token is missing'});
    }
    req.user = null;
    const user = await getUser(token,secret);
    if (!user) {
        return res.status(404).json({'message':'user is not in the database'});
    }
    req.user = user;
    next();
};

