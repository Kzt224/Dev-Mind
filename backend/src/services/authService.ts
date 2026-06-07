import { PrismaClient, User } from "../../generated/prisma/index.js";
import { descryptPassword, encryptPassword } from "../libs/hashpassword.js";
import { generateToken } from "../libs/jwt.js";
import { SendNotification } from "../controller/notiAutoMation.controller.js";
import { CreateUserDto } from "../dto/create-user.dto.js";
import { AuthResultDto } from "../dto/authResult.dto.js";


export class AuthServices {
    private prisma = new PrismaClient();
    // signup
    async signUp(data: CreateUserDto): Promise<AuthResultDto> {
        const { email, password, name } = data;
        if (!email || !password || !name) {
            return { status: 400, json: { message: "Username, email and password are require" } };
        }
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { status: 400, json: { message: "Email address is already exist!" } };
        }
        const hashedPassword = await encryptPassword(password);
        const result = await this.prisma.user.create({ data: { name, email, password: hashedPassword } });

        const token = await generateToken(result);
        const Handler = (SendNotification as any).default || SendNotification;
        const notification = new Handler({ user: result });
        await notification.sendSignupNoti();
        return {
            status: 200,
            json: {
                message: "Account created successfully!",
                jwt: token,
                user: { id: result.id, name: result.name, email: result.email, role: result.role },
            },
        };
    }
    // login
    async logIn(data: CreateUserDto): Promise<AuthResultDto> {
        try {
            const { email, password } = data;
            if (!email || !password) {
                return { status: 400, json: { message: "Email and password are require!" } };
            }

            const existingUser = await this.prisma.user.findUnique({ where: { email } });
            if (!existingUser) {
                return { status: 404, json: { message: "User not found. Please Signup!" } };
            }
            if (!existingUser.password) {
                return { status: 400, json: { message: "This account does not use a password login." } };
            }
            const isCorrect = descryptPassword(password, existingUser.password);
            if (!isCorrect) {
                return { status: 401, json: { message: "Incorrect password. Please try again!" } };
            }
            const token = generateToken(existingUser);
            return { status: 200, json: { message: "Login successfully!", jwt: token } };
        } catch (error) {
            console.log("Error on auth service", error);
            return {
                status: 500,
                json: { "message": "Internal server error" }
            }
        }

    }
}


