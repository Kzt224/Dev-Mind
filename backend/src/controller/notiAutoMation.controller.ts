
import { AssignNotificationProps, ModifyNotiProps, SendNotificationProps } from "../dto/notiController.dto.js";
import { createAndEmitNotification } from "../libs/notificationService.js";
import prisma from "../libs/prisma.js";


export class SendNotification {
    protected prisma;
    private user;
    private leaderId;
    private memberId;
    private inviteStatus;
    private requestId;
    protected socketIo;
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
                    status: { equals: "DONE" },
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
                await createAndEmitNotification(this.prisma, this.socketIo, {
                    header: 'Important! your on delay',
                    body: `Your task ${data.name} is Delay ${data.delay} days`,
                    authorId: data.authorId,
                    projectId: data.projectId
                });
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
            await createAndEmitNotification(this.prisma, this.socketIo, {
                header: `Welcome!`,
                body: `Thank! you for choosing our application(Dev Mind)`,
                authorId: Number(this.user?.id),
            });
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
            return await createAndEmitNotification(this.prisma, this.socketIo, {
                header: "Request Group Join!",
                body: `${user?.name} request to join to group!`,
                authorId: Number(this.leaderId),
                type: "REQUEST",
                requestId: Number(this.requestId),
            });
        } catch (error) {
            console.log(error);
        }
    }
    async sendRequestFeekBackNoti() {
        try {
            const accepted = this.inviteStatus === "ACCEPTED";
            return await createAndEmitNotification(this.prisma, this.socketIo, {
                header: `You have been ${accepted ? "accepted" : "rejected"} to join the group`,
                body: accepted
                    ? "Leader accepted your request. You can now work on assigned tasks."
                    : "Sorry! The leader rejected your request.",
                authorId: Number(this.memberId),
            });

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
                await createAndEmitNotification(this.prisma, this.socketIo, {
                    header: 'Congrate! your finish task',
                    body: `Your task ${data.name} is Finished before deadline`,
                    authorId: data.authorId,
                    projectId: data.projectId,
                });

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
            // create notification for the assigned member (recipient = memberId)
            return await createAndEmitNotification(this.prisma, this.socketIo, {
                header: `You have been assigned a task`,
                body: `${assigner?.name || 'Someone'} assigned you the task: ${taskName}`,
                authorId: Number(memberId), // recipient
                projectId: projectId ? Number(projectId) : undefined,
                type: "ASSIGN",
                taskId: taskId ? Number(taskId) : undefined,
            });
        } catch (error) {
            console.error("sendAssignNoti error:", error);
        }
    }
    async sendModifyNoti({ recipientId, modifierId, taskId, projectId, taskName }: ModifyNotiProps) {
        try {
            const modifier = await this.prisma.user.findUnique({ where: { id: Number(modifierId) } });
            return await createAndEmitNotification(this.prisma, this.socketIo, {
                header: `Task updated`,
                body: `${modifier?.name || 'Someone'} updated the task: ${taskName}`,
                authorId: Number(recipientId),
                projectId: projectId ? Number(projectId) : undefined,
                type: "MODIFY",
                taskId: taskId ? Number(taskId) : undefined,
            });
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