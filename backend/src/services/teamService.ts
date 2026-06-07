import { JoinStatus, PrismaClient } from "../../generated/prisma/index.js";
import { SendNotification } from "../controller/notiAutoMation.controller.js";
import { logger } from "../libs/LogGenerator.js";
import { v4 as uuidv4 } from 'uuid';

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

    async createGroup(userId: number, name: string) {
        try {
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
                return { status: 200, json: { token: updated.token } };
            }
            const created = await this.prisma.invitation.create({
                data: { groupId: groupId, leaderId: userId, token, expiresAt },
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

    async sentMemberToFeedBack(userId: number, requestId: number, status: JoinStatus, io: any) {
        try {
            if (!requestId || !status) return { status: 400, json: { message: "Invalid request data" } };

            const joinRequest = await this.prisma.joinRequest.findUnique({ where: { id: Number(requestId) } });
            if (!joinRequest) return { status: 404, json: { message: "Join request not found" } };
            if (joinRequest.joinStatus === status) {
                return { status: 200, json: { message: "Status already updated" } };
            }
            await this.prisma.joinRequest.update({ where: { id: joinRequest.id }, data: { joinStatus: status, retryAt: null } });
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
            } else {
                //
            }
            await this.emitNoti({
                receiverId: joinRequest.userId,
                requestId: joinRequest.id,
                inviteStatus: status,
                type: "REQUEST"
            }, io);
            return {
                status: 200,
                json: {
                    message: status === "ACCEPTED" ? "User accepted and added to group" : "User request rejected",
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
}
// note
// tomorrow create task controller.ts and task.route.ts