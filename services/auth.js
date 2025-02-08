import jwt from "jsonwebtoken";

export const secret = process.env.jwt_secret_key;

export const getUser = async (token) => {
    if (!token) {
        return null;
    }
    try {
        return jwt.verify(token,secret);
    } catch (error) {
        return null;
    }
};