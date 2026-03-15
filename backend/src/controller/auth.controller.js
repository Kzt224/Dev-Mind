import { descryptPassword, encryptPassword } from "../libs/hashpassword.js";
import { generateToken } from "../libs/jwt.js";
import { PrismaClient } from "../../generated/prisma/index.js";
import SendNotification from "./notiAutoMation.controller.js";
const prisma = new PrismaClient();

export const signUp = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "Username, email and password are require" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email address is already exist!" });
        }

        const hashedPasswrod = await encryptPassword(password);
        const result = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPasswrod
            }
        });
        const token = await generateToken(result);
        const notification = new SendNotification({ user: result });
        await notification.sendSignupNoti();
        return res.status(200).json({
            message: "Account created successfully!",
            jwt: token,
            user: {
                id: result.id,
                name: result.name,
                email: result.email,
                role: result.role
            }
        });
    } catch (error) {
        console.log("Error on signUp function", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are require!" });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found. Please Signup!" });
        }
        const isCorrect = descryptPassword(password, existingUser.password);
        if (!isCorrect) {
            return res.status(401).json({ message: "Incorrect password. Please try again!" });
        }
        const token = generateToken(existingUser);
        return res.status(200).json({ message: "Login successfully!", jwt: token });
    } catch (error) {
        console.log("Error on login function", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
