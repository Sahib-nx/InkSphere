import { User } from '../../../models/userModel';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { messageHandler } from '../../../utils/messageHandler';
import dbConnect from '@/lib/mongodb';


const login = async (req, res) => {

    try {

        if (req.method !== "POST") {

            return res.status(405).send({ message: " Only POST Method allowed" });

        }

        await dbConnect();

        const { email, password } = req.body;
        if (!email || !password) {

            return messageHandler(res, 400, "All Fields Are Required");

        }



        const user = await User.findOne({ email })

        if (!user) {

            return messageHandler(res, 400, "User Not Found With This Email");
        }


        const VerifyPass = await bcrypt.compare(password, user.password);
        if (VerifyPass) {

            const secretkey = process.env.JWT_SECRET_KEY;

            if (!secretkey) {
                return messageHandler(res, 500, "JWT secret key not configured");
            }

            const userId = user._id;

            const token = jwt.sign({ userId }, secretkey, {
                expiresIn: "1h"
            });

            const expires = new Date(Date.now() + 48 * 60 * 60 * 1000).toUTCString();
            res.setHeader(
                "Set-Cookie",
                `token=${token}; HttpOnly; Path=/; SameSite=Strict; Expires=${expires}`
            );

            return messageHandler(res, 200, "Login Successfull" )
          
        } else {

            return messageHandler(res, 400, "Invalid Password" );

        }


    } catch (error) {

        console.error("LOGIN ERROR:", error); 
        return messageHandler(res, 500, "Server Error!");

    }
}

export default login