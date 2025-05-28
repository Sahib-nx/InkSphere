import { messageHandler } from '../../../utils/messageHandler'
import { User } from '../../../models/userModel';
import jwt from "jsonwebtoken"
import dbConnect from '@/lib/mongodb';

const getUser = async (req, res) => {

    if (req.method !== "GET") {

        return messageHandler(res, 400, "Only Get method Allowed!");
    }

    try {

        await dbConnect();

        const { token } = req.cookies;

        if (token === undefined || !token) {
            return messageHandler(res, 401, "I Can't Find The Token!");
        }

        const secretkey = process.env.JWT_SECRET_KEY;

        if (!secretkey) {
            return messageHandler(res, 500, "JWT secret key not configured");
        }

        const verify = await jwt.verify(token, secretkey);

        if (verify) {

            console.log(verify.userId)

            const user = await User.findById(verify.userId);

            if (user) {
                return messageHandler(res, 200, undefined, user)
            }
        } else {
            return messageHandler(res, 401, "Invalid Token");
        }

    } catch (error) {

        console.error("Error in getUser:", error);
        return messageHandler(res, 500, "Internal Server Error");

    }

};

export default getUser