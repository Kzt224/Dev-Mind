
import { AssignNotificationProps, ModifyNotiProps, SendNotificationProps } from "../dto/notiController.dto.js";
import { notiData } from "../dto/notiData.dto.js";
import { logger } from "../libs/LogGenerator.js";
import { createAndEmitNotification } from "../libs/notificationService.js";
import prisma from "../libs/prisma.js";
import { NotificationService } from "../services/notificationService.js";


export class SendNotification {
    protected prisma;
    private user;
    private leaderId;
    private memberId;
    private inviteStatus;
    private requestId;
    protected socketIo;
    protected notiService;
    constructor({
        user = null,
        leaderId = 0,
        memberId = 0,
        inviteStatus = '',
        requestId = 0,
        socketIo = null,
    }: SendNotificationProps = {}) {
        this.prisma = prisma;
        this.user = user;
        this.leaderId = leaderId;
        this.memberId = memberId;
        this.inviteStatus = inviteStatus;
        this.requestId = requestId;
        this.socketIo = socketIo;
        this.notiService = new NotificationService();
    }
    async getDelayTask() {
        try {
            return await this.prisma.task.findMany({
                where: {
                    delay: {
                        not: 0
                    },
                    status: { not: "DONE" }
                }
            });
        } catch (error) {
            console.log("Error on sentNotificaiton,getDelayTask")
        }
    }
    async getFinishedTask() {
        try {
            return await this.prisma.task.findMany({
                where: {
                    OR: [
                        { status: { equals: "DONE" } },
                        { progress: { equals: 100 } }
                    ],
                    notifiable: { equals: false }
                }
            });
        } catch (error) {
            console.log("Error on sentNotificaiton,getFinishedTask")
        }
    }
    async sendDelayNoti() {
        try {
            const result = await this.getDelayTask();
            if (result?.length === 0 || result === undefined) return;
            for (const data of result) {
                const delayData: notiData = {
                    header: 'Important! your on delay',
                    body: `Your task ${data.name} is Delay ${data.delay} days`,
                    authorId: data.authorId,
                    projectId: data.projectId
                }
                await this.notiService.createAndEmitNotification(delayData, this.socketIo);
                await this.prisma.task.update({
                    where: { id: data.id },
                    data: {
                        notifiable: true
                    }
                });
            }
        } catch (error) {
            console.log("Error on sentNotificaiton,sentDeleyNoti")
        }
    }
    async sendSignupNoti() {
        try {
            const signUpData: notiData = {
                header: `Welcome!`,
                body: `Thank! you for choosing our application(Dev Mind)`,
                authorId: Number(this.user?.id),
            }
            await this.notiService.createAndEmitNotification(signUpData, this.socketIo);
        } catch (error) {
            console.log(error);
        }
    }
    async sendReqestConfirmNoti() {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: Number(this.memberId)
                }
            });
            const confirmData: notiData = {
                header: "Request Group Join!",
                body: `${user?.name} request to join to group!`,
                authorId: Number(this.leaderId),
                type: "REQUEST",
                requestId: Number(this.requestId),
            }
            return await this.notiService.createAndEmitNotification(confirmData, this.socketIo);
        } catch (error) {
            logger.error("Notiautomation controller.sendRequestConfirmNoti failed!", {
                userId: this.memberId,
                error: error
            });
            console.log(error);
        }
    }
    async sendRequestFeekBackNoti() {
        try {
            const accepted = this.inviteStatus === "ACCEPTED";
            const feedBackData: notiData = {
                header: `You have been ${accepted ? "accepted" : "rejected"} to join the group`,
                body: accepted
                    ? "Leader accepted your request. You can now work on assigned tasks."
                    : "Sorry! The leader rejected your request.",
                authorId: Number(this.memberId),
            }
            return await this.notiService.createAndEmitNotification(feedBackData, this.socketIo);
        } catch (error) {
            console.error("sendRequestFeekBackNoti error:", error);
            throw error;
        }
    }
    async sendTaskFinishedNoti() {
        try {
            const result = await this.getFinishedTask();
            if (result?.length === 0 || result == undefined) return;
            for (const data of result) {
                const finishData: notiData = {
                    header: 'Congrate! your finish task',
                    body: `Your task ${data.name} is Finished before deadline`,
                    authorId: data.authorId,
                    projectId: data.projectId,
                }
                await this.notiService.createAndEmitNotification(finishData, this.socketIo);
                await this.prisma.task.update({
                    where: { id: data.id },
                    data: {
                        notifiable: true
                    }
                });
            }
        } catch (error) {
            console.log("Error on sentNotificaiton,sentFinishedTaskNoti")
        }
    }
    async sendAssignNoti({ memberId, authorId, taskId, projectId, taskName }: AssignNotificationProps) {
        try {
            const assigner = await this.prisma.user.findUnique({
                where: { id: Number(authorId) }
            });
            const assignData: notiData = {
                header: `You have been assigned a task`,
                body: `${assigner?.name || 'Someone'} assigned you the task: ${taskName}`,
                authorId: Number(memberId), // recipient
                projectId: projectId ? Number(projectId) : undefined,
                type: "ASSIGN",
                taskId: taskId ? Number(taskId) : undefined,
            }
            // create notification for the assigned member (recipient = memberId)
            return await this.notiService.createAndEmitNotification(assignData, this.socketIo);
        } catch (error) {
            console.error("sendAssignNoti error:", error);
        }
    }
    async sendModifyNoti({ recipientId, modifierId, taskId, projectId, taskName }: ModifyNotiProps) {
        try {
            const modifier = await this.prisma.user.findUnique({ where: { id: Number(modifierId) } });
            const modifyData: notiData = {
                header: `Task updated`,
                body: `${modifier?.name || 'Someone'} updated the task: ${taskName}`,
                authorId: Number(recipientId),
                projectId: projectId ? Number(projectId) : undefined,
                type: "MODIFY",
                taskId: taskId ? Number(taskId) : undefined,
            }
            return await this.notiService.createAndEmitNotification(modifyData, this.socketIo);
        } catch (error) {
            console.error("sendModifyNoti error:", error);
        }
    }
    async sendNotification() {
        try {
            await this.sendDelayNoti();
            await this.sendTaskFinishedNoti();
        } catch (error) {
            console.log("Error on sendNotification:", error);
        }
    }
}