import { PrismaClient } from "../../generated/prisma/index.js";
import { SendNotification } from "../controller/notiAutoMation.controller.js";
import { ResponseDto } from "../dto/response.dto.js";
import { logger } from "../libs/LogGenerator.js";

interface AssignProp {
    projectId: number;
    taskId: number;
    assignUserId: number;
    userId: number;
    io: any;
}
export class AssignService {
    private prisma = new PrismaClient();

    async assignTask(data: AssignProp): Promise<ResponseDto> {
        const { projectId, taskId, assignUserId, userId, io } = data;
        try {
            if (!projectId || !taskId || !assignUserId) {
                return { status: 400, json: { message: "Require projectId, taskId, and assignUserId" } };
            }
            const task = await this.prisma.task.findUnique({ where: { id: Number(taskId) } });
            if (!task) return { status: 404, json: { message: "Task not found" } };

            if (task.assignId) {
                return { status: 400, json: { message: "This task is already assigned" } };
            }

            if (task.authorId !== Number(userId)) {
                return { status: 400, json: { message: "Admin only can assign" } };
            }

            if (task.status === "DONE") {
                return { status: 400, json: { message: "This task is already done, can't assign" } };
            }
            const project = await this.prisma.project.findUnique({ where: { id: Number(projectId) }, select: { name: true } });
            if (!project) return { status: 404, json: { message: "Project not found" } };

            await this.prisma.$transaction(async (tx) => {
                await tx.assignTrack.create({
                    data: {
                        project: { connect: { id: Number(projectId) } },
                        task: { connect: { id: Number(taskId) } },
                        assignUser: { connect: { id: Number(assignUserId) } }
                    }
                });
                await tx.task.update({
                    where: {id: Number(taskId)},
                    data: {
                        assignId: Number(assignUserId)
                    }
                })
            })

            try {
                const noti = new SendNotification({ socketIo: io });
                const notification = await noti.sendAssignNoti({
                    memberId: assignUserId,
                    authorId: userId,
                    taskId,
                    projectId,
                    taskName: task.name,
                });

                if (notification && io) {
                    io.to(`user_${assignUserId}`).emit("notification", {
                        header: notification.header,
                        body: notification.body,
                        type: notification.type,
                        taskId: notification.taskId,
                    });
                }
            } catch (error) {
                console.error("Error sending notification:", error);
            }
            return {
                status: 200,
                json: { "message": `Assign task to ${userId} successfully` }
            }
        } catch (error) {
            logger.error("TeamService.userConntectWithInviteLink failed!", {
                userId: userId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
}