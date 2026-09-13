import { PrismaClient } from "../../generated/prisma/index.js";
import UserNoti from "../controller/userNoti/updateUserInfoNoti.js";
import cloudinary from "../libs/cloudinary.cfg.js";
import { encryptPassword } from "../libs/hashpassword.js";
import { logger } from "../libs/LogGenerator.js";

interface User {
    email: string;
    phone: string;
    userName: string;
    name: string
}

export class UserService {
    private prisma = new PrismaClient();

    async findUser(id: number) {
        const result = await this.prisma.user.findUnique({ where: { id: Number(id) } });
        if (!result) return { status: 404, json: { message: "User not found" } };
        return {
            status: 200,
            json: {
                user: {
                    id: result?.id,
                    name: result.name,
                    email: result.email,
                    phone: result.phone,
                    userName: result.userName,
                    profilePicture: result.profilePicture
                },
            },
        };
    }
    async updateUser(id: number, data: User, io: any) {
        const { email, phone, userName, name } = data;
        if (!email && !phone && !userName && !name) {
            return { status: 400, json: { message: "Require email, phone, username, or name to update" } };
        }

        if (email) {
            const existing = await this.prisma.user.findUnique({ where: { email } });
            if (existing && existing.id !== Number(id)) {
                return { status: 400, json: { message: "Email already in use by another account" } };
            }
        }

        const result = await this.prisma.user.update({
            where: { id: Number(id) },
            data: { email, phone, userName, name },
        });
        const notification = (UserNoti as any).default || UserNoti;
        const noti = new notification({ date: result.updatedAt, userId: Number(id), socketIo: io });
        await noti.updateInfoNoti();

        return { status: 200, json: { message: "User info updated successfully", data: result } };
    }

    async updatePassword(id: number, password: string, io: any) {
        if (!password) return { status: 400, json: { message: "Password required" } };
        if (password.length < 8) return { status: 400, json: { message: "Password must be at least 8 characters" } };

        const hashedPassword = await encryptPassword(password);
        if (!hashedPassword) return { status: 500, json: { message: "Internal server error" } };

        await this.prisma.user.update({ where: { id: Number(id) }, data: { password: hashedPassword } });
        const notification = (UserNoti as any).default || UserNoti;
        const noti = new notification({ date: new Date().toISOString(), userId: Number(id), socketIo: io });
        await noti.updatePasswordNoti();

        return { status: 200, json: { message: "Password updated successfully" } };
    }
    async getSignature(userId: number) {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const folder = "DevMind/user_profile";
            const apiSecret = process.env.CLOUDINARY_API_SECRECT;
            const apiKey = process.env.CLOUDINARY_API_KEY;
            const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
            if (!apiSecret || !apiKey || !cloudName) {
                throw new Error("Missing Cloudinary environment variables on backend.");
            }
            const paramToSign = {
                folder: folder,
                timestamp: timestamp,
            };

            const signature = cloudinary.utils.api_sign_request(
                paramToSign,
                apiSecret || ""
            );
            console.log("CLOUDINARY CONFIG:", {
                cloudName,
                apiKey,
                folder,
                timestamp,
            });

            console.log("SIGNATURE:", signature);

            return {
                status: 200,
                json: {
                    signature,
                    timestamp,
                    apiKey: apiKey,
                    cloudName: cloudName,
                    folder,
                }
            };
        } catch (error) {
            logger.error("UserService.getSignature failed!", { userId, error });
            return {
                status: 500,
                json: { message: "Internal server error" }
            };
        }
    }
    async uploadProfile(imageUrl: string, userId: number) {
        try {
            if (!imageUrl) {
                return {
                    status: 400,
                    json: { message: "Image url is required" }
                }
            }
            await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    profilePicture: imageUrl
                }
            })
            return {
                status: 200,
                json: { message: "Profile uploaded successfully!" }
            }
        } catch (error) {
            logger.error("UserService.uploadProfile failed!", { userId, error });
            return {
                status: 500,
                json: { message: "Internal server error" }
            };
        }
    }
}