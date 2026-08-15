import { Group, JoinStatus, PrismaClient } from "../../generated/prisma/index.js";
import { SendNotification } from "../controller/notiAutoMation.controller.js";
import { logger } from "../libs/LogGenerator.js";
import { v4 as uuidv4 } from 'uuid';
import { NotificationService } from "./notificationService.js";

interface ReturnGroup {
    id: number;
    name: string;
    ownerId: number;
    totalMember: number
}
class RequestData {
    groupId!: number;
    qrToken!: string
}
class groupData {
    name!: string;
}
class groupLeftRequest {
    changeUserId!: number;
    groupId!: number;
    requestUserName!: string
}
interface notiData {
    header: string,
    body: string,
    authorId: number,
    info?: string,
    type: any
}

interface NotificationPayload {
    receiverId: number;
    requestId?: number;
    inviteStatus?: JoinStatus;
    token?: string;
    type: "JOIN" | "REQUEST";
}

interface SocketEmitPayload {
    room: string;
    event: string;
    data: {
        header: string;
        body: string;
        type: string;
        token?: string;
        requestId?: number;
    };
}

export class TeamService {
    private prisma = new PrismaClient();

    async createGroup(userId: number, data: Group) {
        try {
            const { name } = data;
            if (!name) return { status: 400, json: { message: "Group name is required" } };
            const result = await this.prisma.group.create({
                data: { name, ownerId: Number(userId) },
            });
            if (result) {
                await this.prisma.groupMember.create({
                    data: { groupId: Number(result.id), userId: Number(result.ownerId), role: "ADMIN" },
                });
            }
            return { status: 200, json: { message: "Group Created successfully!" } };
        } catch (error) {
            logger.error("TeamService.createGroup failed!", {
                userId: userId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
    async getAllGroup(userId: number) {
        if (!userId) return { status: 401, json: { message: "Unauthorized" } };
        try {
            const groups = await this.prisma.group.findMany({
                where: {
                    OR: [
                        { ownerId: Number(userId) },
                        { members: { some: { userId: Number(userId) } } },
                    ],
                },
                include: {
                    members: { include: { user: true } },
                },
            });
            if (!groups || groups.length === 0) return { status: 404, json: { message: "No group found" } };

            const responseData: ReturnGroup[] = groups.map((g) => ({
                id: g?.id ?? 0,
                name: g?.name ?? '',
                ownerId: g?.ownerId ?? 0,
                totalMember: g?.members?.length ?? 0,
            }));

            return { status: 200, json: responseData };
        } catch (error) {
            logger.error("TeamService.getAllGroup failed!", {
                userId: userId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
    async getGroupDetail(groupId: number, userId: number) {
        if (!userId) return { status: 401, json: { message: "Unauthorized" } };
        try {
            if (!groupId) return { status: 400, json: { message: "Group Id is required" } };

            const result = await this.prisma.groupMember.findMany({
                where: { groupId: Number(groupId) },
                include: { user: { omit: { password: true } } },
            });
            const isAdmin: boolean = result.some((r) => r.role === "ADMIN" && r.userId === Number(userId));
            return {
                status: 200,
                json: {
                    result,
                    permission: { isAdmin, canInvite: isAdmin, canRemove: isAdmin, canAssign: isAdmin },
                },
            };
        } catch (error) {
            logger.error("TeamService.getGroupDetail failed!", {
                userId: userId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
    async generateInviteLink(groupId: number, userId: number) {
        if (!userId) return { status: 401, json: { message: "Unauthorized" } };
        try {
            if (!groupId) return { status: 400, json: { message: "groupId is required" } };
            const token = uuidv4();
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);

            const existingInvitation = await this.prisma.invitation.findFirst({
                where: { groupId: Number(groupId), leaderId: Number(userId) },
            });
            if (existingInvitation) {
                const updated = await this.prisma.invitation.update({
                    where: { id: existingInvitation.id },
                    data: { token, expiresAt },
                });
                const test = updated?.token;
                logger.debug("debug", {
                    test
                });
                return { status: 200, json: { token: updated.token } };
            }
            const created = await this.prisma.invitation.create({
                data: { groupId: groupId, leaderId: userId, token, expiresAt },
            });
            const test = created?.token;
            logger.debug("debug", {
                test
            });
            return { status: 200, json: { token: created.token } };
        } catch (error) {
            logger.error("TeamService.generateInviteLink failed!", {
                userId: userId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
    async checkInviteToken(token: string, userId: number) {

        try {
            const invite = await this.prisma.invitation.findUnique({ where: { token: token } });
            if (!invite) return { status: 404, json: { message: "Invalid invite link" } };

            if (invite.leaderId === Number(userId)) {
                return { status: 400, json: { message: "You cann't join your group!." } };
            }

            if (new Date() > invite.expiresAt) {
                return { status: 400, json: { message: "Invite link is expire" } };
            }
            return { status: 200, json: { message: "You need to join group?", gId: invite.groupId } };
        } catch (error) {
            logger.error("TeamService.checkInviteToken failed!", {
                userId: userId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
    async userConnectWithInviteLink(userId: number, data: RequestData, io: any) {
        try {
            const { groupId, qrToken } = data;
            const invitation = await this.prisma.invitation.findFirst({
                where: { groupId: Number(groupId), token: qrToken },
            });
            if (!invitation) return { status: 404, json: { message: "Invalid or expired invite link." } };

            const currentTime = new Date();
            let joinRequest = await this.prisma.joinRequest.findUnique({
                where: { groupId_userId: { groupId: invitation.groupId, userId: Number(userId) } },
            });
            if (joinRequest) {
                if (joinRequest.joinStatus === "PENDING" && joinRequest.retryAt && currentTime < joinRequest.retryAt) {
                    const minutes = Math.ceil((joinRequest.retryAt.getTime() - currentTime.getTime()) / 60000);
                    return { status: 400, json: { message: `${minutes} min cooldown. Please wait.` } };
                }
                if (joinRequest.joinStatus === "ACCEPTED") {
                    return { status: 400, json: { message: "You have already join this group" } };
                }

                joinRequest = await this.prisma.joinRequest.update({
                    where: { id: joinRequest.id },
                    data: { joinStatus: "PENDING", retryAt: new Date(currentTime.getTime() + 60 * 60 * 1000) },
                });
            } else {
                joinRequest = await this.prisma.joinRequest.create({
                    data: { groupId: invitation.groupId, userId: Number(userId), joinStatus: "PENDING", retryAt: new Date(currentTime.getTime() + 60 * 60 * 1000) },
                });
            }

            await this.emitNoti({
                receiverId: invitation.leaderId,
                requestId: joinRequest.id,
                token: qrToken,
                type: "JOIN"
            }, io);
            return {
                status: 200,
                json: { message: "Successfully connect with link" }
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
    async GroupLeftRequest(data: groupLeftRequest, userId: number, io: any) {
        try {
            const { changeUserId, groupId, requestUserName } = data;
            const groupResult = await this.prisma.groupMember.findFirst({
                where: {
                    AND: [
                        { groupId: groupId },
                        { userId: userId }
                    ]
                }
            });
            if (!groupResult) {
                return {
                    status: 404,
                    json: "You are not in this group.Try again!"
                }
            }
            if (groupResult?.role === "ADMIN") {
                await this.adminGroupLeft(changeUserId, groupId, userId, io)
            } else {
                await this.userGroupLeft(userId, groupId, requestUserName, io)
            }
            return {
                status: 200,
                json: { message: "Group left request was sent." }
            }
        } catch (error) {
            logger.error("TeamService.groupLeftRequest failed!", {
                userId: userId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
    async adminGroupLeft(chUserId: number, gpId: number, requestLeftUserId: number, io: any) {
        try {
            const updateResult = await this.prisma.$transaction(async (tx) => {
                const updateGroup = await tx.group.update({
                    where: { id: gpId },
                    data: {
                        ownerId: chUserId
                    }
                });
                await tx.groupMember.update({
                    where: {
                        groupId_userId: {
                            groupId: gpId,
                            userId: chUserId
                        }
                    },
                    data: {
                        role: "ADMIN"
                    }
                })
                await tx.groupMember.delete({
                    where: {
                        groupId_userId: {
                            groupId: gpId,
                            userId: requestLeftUserId
                        }
                    }
                });
                return updateGroup;
            });
            const leftUserData: notiData = {
                header: "Alert!",
                body: `You was left from ${updateResult?.name} group successfully!`,
                authorId: requestLeftUserId,
                type: "ALERT",
            }
            const newAdminData: notiData = {
                header: "Congratulation!",
                body: `You was become admin of ${updateResult.name} group`,
                authorId: chUserId,
                type: "ALERT"
            }
            const noti = new NotificationService();
            await noti.createAndEmitNotification(leftUserData, io);
            await noti.createAndEmitNotification(newAdminData, io);
            return {
                status: 200,
                json: { message: "You was left from group successsully" }
            }
        } catch (error) {
            logger.error("TeamService.adminGroupLeft failed!", {
                userId: requestLeftUserId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
    async userGroupLeft(userId: number, groupId: number, reqUserName: string, io: any) {
        try {
            const groupAdmin = await this.prisma.group.findFirst({
                where: { id: groupId },
                select: { ownerId: true }
            })
            if (!groupAdmin) {
                return;
            }
            await this.prisma.joinRequest.create({
                data: {
                    groupId,
                    userId,
                    info: 'LEFT',
                    joinStatus: "PENDING"
                }
            });
            const adminNoti: notiData = {
                header: `Alert user ${reqUserName} was reqest to leave group`,
                body: "I wanna left from group so my assign task to take back",
                authorId: groupAdmin?.ownerId,
                info: "LEFT",
                type: "REQUEST"
            }
            const noti = new NotificationService();
            await noti.createAndEmitNotification(adminNoti, io);
            return {
                status: 200,
                json: { message: "You was request to left group successsully" }
            }
        } catch (error) {
            logger.error("TeamService.groupLeftRequest failed!", {
                userId: userId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
    async handleAcceptLeftGroup(requestId: number, joinRequest: any, status: string, io: any) {
        try {
            if (status === "ACCEPTED") {
                await this.prisma.$transaction(async (tx) => {
                    const admin = await tx.group.findUnique({
                        where: { id: joinRequest?.groupId },
                        select: { ownerId: true }
                    })
                    await tx.task.updateMany({
                        where: {
                            groupId: joinRequest.groupId,
                            assignedUserId: joinRequest.userId,
                            status: {
                                not: "DONE",
                            },
                        },
                        data: {
                            assignedUserId: admin?.ownerId,
                        },
                    });
                    await tx.groupMember.delete({
                        where: {
                            groupId_userId: {
                                groupId: joinRequest.groupId,
                                userId: joinRequest.userId
                            }
                        }
                    });
                    await tx.joinRequest.update({
                        where: {
                            id: requestId
                        },
                        data: {
                            joinStatus: "ACCEPTED"
                        }
                    });
                });
                const leftNoti: notiData = {
                    header: `Alert!`,
                    body: "You was successfully left from grup.",
                    authorId: joinRequest.userId,
                    info: "LEFT",
                    type: "ALERT"
                }
                const noti = new NotificationService()
                await noti.createAndEmitNotification(leftNoti, io);
            }
        } catch (error) {

        }
    }
    async handleAcceptedJoinGroup(requestId: number, joinRequest: any, status: string, io: any) {
        try {
            if (status === "ACCEPTED") {
                await this.prisma.groupMember.upsert({
                    where: { groupId_userId: { groupId: joinRequest.groupId, userId: joinRequest.userId } },
                    update: {},
                    create: { groupId: joinRequest.groupId, userId: joinRequest.userId, role: "MEMBER" },
                });

                await this.prisma.notification.updateMany({
                    where: { requestId: Number(requestId) },
                    data: { isAction: true },
                });
                await this.emitNoti({
                    receiverId: joinRequest.userId,
                    requestId: joinRequest.id,
                    inviteStatus: status,
                    type: "REQUEST"
                }, io);
            }
        } catch (error) {
            logger.error("TeamService.handleAcceptedJoinGroup failed!", {
                userId: requestId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
    async sentMemberToFeedBack(userId: number, requestId: number, status: JoinStatus, info: string, io: any) {
        try {
            if (!requestId || !status) return { status: 400, json: { message: "Invalid request data" } };

            const joinRequest = await this.prisma.joinRequest.findUnique({ where: { id: Number(requestId) } });
            if (!joinRequest) return { status: 404, json: { message: "Join request not found" } };
            if (joinRequest.joinStatus === status) {
                return { status: 200, json: { message: "Status already updated" } };
            }
            await this.prisma.joinRequest.update({ where: { id: joinRequest.id }, data: { joinStatus: status, retryAt: null } });
            if (info === "JOIN") {
                await this.handleAcceptedJoinGroup(requestId, joinRequest, status, io)
            } else {
                await this.handleAcceptLeftGroup(requestId, joinRequest, status, io)
            }
            return {
                status: 200,
                json: {
                    message: status === "ACCEPTED" ? "Accepted the user request" : "User request rejected",
                },
            };
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
    private async emitNoti(payload: NotificationPayload, io?: any) {
        try {

            const noti = new SendNotification({
                memberId: payload.receiverId,
                leaderId: payload.receiverId,
                requestId: payload.requestId,
                inviteStatus: payload.inviteStatus
            });

            const notification =
                payload.type === "JOIN"
                    ? await noti.sendReqestConfirmNoti()
                    : await noti.sendRequestFeekBackNoti();

            if (!notification) {
                return {
                    status: 500,
                    json: { message: "Notification failed" }
                };
            }

            const socketPayload: SocketEmitPayload = {
                room: `user_${payload.receiverId}`,
                event: "notification",
                data: {
                    header: notification.header,
                    body: notification.body,
                    type: notification.type,
                    token: payload.token,
                    requestId: payload.requestId
                }
            };

            if (io) {
                io.to(socketPayload.room).emit(
                    socketPayload.event,
                    socketPayload.data
                );
            }

        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
    async searchMember(userId: number, query: string): Promise<object> {
        try {
            const members = await this.prisma.groupMember.findMany({
                where: {
                    OR: [
                        {
                            user: {
                                userName: {
                                    contains: query,
                                    mode: "insensitive"
                                },
                            }
                        },
                        { userId: userId }
                    ]
                }
            });
            if (!members) {
                return {
                    status: 404,
                    json: { message: "Member not found" }
                }
            }
            return members;
        } catch (error) {
            logger.error("TeamService.searchMember failed!", {
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
