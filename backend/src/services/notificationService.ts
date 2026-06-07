import { PrismaClient } from "../../generated/prisma/index.js";
import { logger } from "../libs/LogGenerator.js";

interface NotiId{
    ids: number
}

export class NotificationService {
    private prisma = new PrismaClient();

    async getAllNoti(userId: number) {
        try {
            const result = await this.prisma.notification.findMany({
                where: { authorId: Number(userId) },
                orderBy: { id: "desc" },
                include: { request: true },
            });
            return { status: 200, json: result };
        } catch (error) {
            logger.error("NotificationService.getAllNoti failed!", {
                userId: userId,
                error: error
            })
            return {
                status: 500,
                json: "Internal server error"
            }
        }
    }
    async updateNotiById(userId: number, id: number, isRead: boolean) {
        try {
            const noti = await this.prisma.notification.findUnique({ where: { id: Number(id) } });
            if (!noti) return { status: 404, json: { message: "Notification not found" } };
            if (noti.authorId !== Number(userId)) return { status: 403, json: { message: "Forbidden" } };

            if (noti.read === true) return { status: 200, json: { message: "Notification already read" } };
            await this.prisma.notification.update({ where: { id: Number(id) }, data: { read: Boolean(isRead) } });
            return { status: 200, json: { message: "Read notification successfully!" } };
        } catch (error) {
            logger.error("NotificationService.updateNotiById failed!", {
                userId: userId,
                error: error
            })
            return {
                status: 500,
                json: "Internal server error"
            }
        }
    }

    async addNotiEvidence(userId: number, notiToken: string) {
        try {
            if (!notiToken) return { status: 400, json: { message: "notiToken is required" } };

            await this.prisma.notiEvidence.create({ data: { notiToken, authorId: Number(userId) } });
            return { status: 200, json: { message: "Notieveidence created successfully!" } };
        } catch (error) {
            logger.error("NotificationService.addNotievidence failed!", {
                userId: userId,
                error: error
            })
            return {
                status: 500,
                json: "Internal server error"
            }
        }
    }
    async deleteNotification(ids:NotiId[]) {
        try {
            if (!ids || !Array.isArray(ids) || ids.length === 0) return { status: 400, json: { message: "Id is requied" } };

            await this.prisma.notification.deleteMany({ where: { id: { in: ids.map((x) => Number(x)) } } });
            return { status: 200, json: { message: "Delete notification successfully" } };
        } catch (error) {
            return {
                status: 500,
                json: "Internal server error"
            }
        }
    }
}