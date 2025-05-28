import jwt from "jsonwebtoken"
import { messageHandler } from '../../../utils/messageHandler'

const verifyToken = async (req, res) => {

    if (req.method !== "GET") {

        return messageHandler(res, 400, "Invalid request method");
    }

    try {

        const { token } = req.cookies;

        if (token === undefined || !token) {

            return messageHandler(res, 401, "Token Is Missing!!");

        }

        const secretkey = process.env.JWT_SECRET_KEY;

        if (!secretkey) {
            return messageHandler(res, 500, "JWT secret key not configured");
        }

        const verify = await jwt.verify(token, secretkey);

        if (verify) {

            return messageHandler(res, 200, "Token is valid", verify);

        } else {

            return messageHandler(res, 403, "Invalid token");

        }

    } catch (error) {

        console.error("Token verification error:", error);
        return messageHandler(res, 500, "Token verification failed", error.message);

    }

}

export default verifyToken;