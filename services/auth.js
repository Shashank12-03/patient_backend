import jwt from "jsonwebtoken";


export const getUser = async (token,secret) => {
    try {
        const user = jwt.verify(token,secret);
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        return res.status(500).json({'message':'Interal server error occured','error':error.message});
    }
}