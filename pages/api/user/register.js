import dbConnect from "@/lib/mongodb";
import { User } from "../../../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";





const register = async (req, res) => {

    try {

        if (req.method !== "POST") {

            return res.status(400).json({ message: "POST ARE ONLY ALLOWED ON THIS ROUTE" });

        }

        await dbConnect();

        const { username, email, password } = req.body;

        if (username === "", email === "", password === "") {

            return res.status(400).json({ message: "Please fill in all fields" });

        }



        const user = await User.findOne({ email })

        if (user) {

            return res.status(400).json({ message: "User already exists" });

        }



        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashPassword
        });


        if (newUser) {
            
            const secretkey = process.env.JWT_SECRET_KEY;

            if (!secretkey) {
                return messageHandler(res, 500, "JWT secret key not configured");
            }

            const userId = newUser._id

            const token = jwt.sign({ userId }, secretkey, {
                expiresIn: "1h"
            })

            const expires = new Date(Date.now() + 48 * 60 * 60 * 1000).toUTCString();

            res.setHeader(
                "Set-Cookie",
                `token=${token}; HttpOnly; Path=/; SameSite=Strict; Expires=${expires}`
            );

            return res.status(201).json({ message: "User Cretaed Successfully" });

        } else {

            return res.status(500).json({ message: "User Creation Failed" })
        }



    } catch (error) {

        console.error(error);
        return res.status(500).json({ message: "Server Error!" });

    }
}

export default register;