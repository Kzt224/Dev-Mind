import { PrismaClient } from "../../generated/prisma/index.js";
import { v4 as uuidv4 } from 'uuid';
import SendNotification from "./notiAutoMation.controller.js";


const prisma = new PrismaClient();
export const createGroup = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.userId;
        const result = await prisma.group.create({
            data: {
                name: name.name,
                ownerId: Number(userId)
            }
        });
        if (result) {
            await prisma.groupMember.create({
                data: {
                    groupId: Number(result.id),
                    userId: Number(result.ownerId),
                    role: "ADMIN"
                }
            })
        }
        return res.status(200).json({ message: "Group Created successfully!" });
    } catch (error) {
        throw error;
    }
}
export const getAllGroup = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        const groups = await prisma.group.findMany({
            where: {
                OR: [
                    { ownerId: Number(userId) },
                    { members: { some: { userId: Number(userId) } } }
                ]
            },
            include: {
                members: {
                    include: {
                        user: true
                    }
                }
            }
        });
        if (!groups || groups.length === 0) {
            return res.status(404).json({ message: "No group found" });
        }
        //prepare for response
        let responseData = groups.map(g => ({
            id: g?.id || '',
            name: g?.name || '',
            ownerId: g?.ownerId || '',
            totalMember: g?.members?.length ?? ''
        }));
        return res.status(200).json(responseData);
    } catch (error) {
        console.error("getAllGroup error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const getGroupDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        if (!id) return res.status(400).json({ message: "Group Id is required" });
        const result = await prisma.groupMember.findMany({
            where: {
                groupId: Number(id)
            },
            include: {
                user: {
                    omit: {
                        password: true
                    }
                }
            }
        });
        const isAdmin = result.some((r) => r.role === "ADMIN" && r.userId === userId);
        return res.status(200).json({
            result,
            permission: {
                isAdmin,
                canInvite: isAdmin,
                canRemove: isAdmin,
                canAssign: isAdmin
            }
        });
    } catch (error) {
        console.error("get groupMember error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const generateInviteLink = async (req, res) => {
    try {
        const { groupId } = req.body;
        const userId = req.user.userId;

        const gId = groupId.groupId || groupId;
        const token = uuidv4();
        console.log(token);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const existingInvitation = await prisma.invitation.findFirst({
            where: {
                groupId: Number(gId),
                leaderId: Number(userId)
            }
        });

        if (existingInvitation) {
            const updated = await prisma.invitation.update({
                where: { id: existingInvitation.id },
                data: {
                    token: token,
                    expiresAt: expiresAt
                }
            });
            return res.status(200).json(updated.token);
        }
        await prisma.invitation.create({
            data: {
                groupId: Number(gId),
                leaderId: Number(userId),
                token: token,
                expiresAt: expiresAt,
            }
        });
        res.status(200).json(token);
    } catch (error) {
        console.log("Prisma Error:", error);
        res.status(500).json({ error: "Failed to generate link" });
    }
}
export const checkInviteToken = async (req, res) => {
    try {
        const { inviteToken } = req.body;
        const userId = req.user.userId;
        const currentTime = new Date();
        const invite = await prisma.invitation.findUnique({
            where: {
                token: inviteToken,
            }
        });
        if (!invite) {
            return res.status(404).json({ message: "Invalid invite link" });
        }
        if (invite && invite?.leaderId === userId) {
            return res.status(400).json({ message: "You cann't join your group!." });
        }
        if (currentTime > invite.expiresAt) {
            return res.status(400).json({ message: "Invite link is expire" });
        }
        const groupId = invite.groupId;
        return res.status(200).json({ message: "You need to join group?", gId: groupId });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}
export const userConnectWithInviteLink = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { data } = req.body;
        const currentTime = new Date();
        const invitation = await prisma.invitation.findFirst({
            where: {
                groupId: Number(data.groupId),
                token: data.qrToken,
            }
        });

        if (!invitation) {
            return res.status(404).json({ message: "Invalid or expired invite link." });
        }

        let joinRequest = await prisma.joinRequest.findUnique({
            where: {
                groupId_userId: {
                    groupId: invitation.groupId,
                    userId: userId
                }
            }
        });

        if (joinRequest) {
            if (joinRequest.joinStatus === "PENDING" && joinRequest.retryAt && currentTime < joinRequest.retryAt) {
                const minutes = Math.ceil((joinRequest.retryAt.getTime() - currentTime.getTime()) / 60000);
                return res.status(400).json({
                    message: `${minutes} min cooldown. Please wait.`
                });
            }
            if (joinRequest.joinStatus === "ACCEPTED") {
                return res.status(400).json({
                    message: `You have already join this group`
                });
            }

            joinRequest = await prisma.joinRequest.update({
                where: { id: joinRequest.id },
                data: {
                    joinStatus: "PENDING",
                    retryAt: new Date(currentTime.getTime() + 60 * 60 * 1000) // 1 hour from now
                }
            });
        } else {
            joinRequest = await prisma.joinRequest.create({
                data: {
                    groupId: invitation.groupId,
                    userId: userId,
                    joinStatus: "PENDING",
                    retryAt: new Date(currentTime.getTime() + 60 * 60 * 1000) // 1 hour from now
                }
            });
        }
        try {
            const noti = new SendNotification({ memberId: userId, leaderId: invitation.leaderId, requestId: joinRequest.id });
            const notification = await noti.sendReqestConfirmNoti();
            const io = req.app.get("io");
            io.to(`user_${invitation.leaderId}`).emit("notification", {
                header: notification.header,
                body: notification.body,
                type: notification.type,
                token: invitation.token
            });
        } catch (error) {
            console.error("Error sending notification:", error);
        }

        return res.status(200).json({
            message: "Your join request is pending."
        });

    } catch (error) {
        console.error("Invite Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
export const sentMemberToFeedBack = async (req, res) => {
    try {
        const { requestId, status } = req.body;

        if (!requestId || !status) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        const joinRequest = await prisma.joinRequest.findUnique({
            where: { id: Number(requestId) }
        });

        if (!joinRequest) {
            return res.status(404).json({ message: "Join request not found" });
        }

        if (joinRequest.joinStatus === status) {
            return res.status(200).json({ message: "Status already updated" });
        }

        await prisma.joinRequest.update({
            where: { id: joinRequest.id },
            data: {
                joinStatus: status,
                retryAt: null
            }
        });

        if (status === "ACCEPTED") {
            await prisma.groupMember.upsert({
                where: {
                    groupId_userId: {
                        groupId: joinRequest.groupId,
                        userId: joinRequest.userId
                    }
                },
                update: {},
                create: {
                    groupId: joinRequest.groupId,
                    userId: joinRequest.userId,
                    role: "MEMBER"
                }
            });

            // FIX: updateMany (requestId is NOT unique)
            await prisma.notification.updateMany({
                where: {
                    requestId: Number(requestId)
                },
                data: {
                    isAction: true
                }
            });
        }

        // 5️⃣ Send feedback notification to user
        const notiService = new SendNotification({
            inviteStatus: status,                // FIXED key
            memberId: joinRequest.userId,
            requestId: joinRequest.id,
            socketIo: req.app.get("io")           // FIXED socket injection
        });

        const notification = await notiService.sendRequestFeekBackNoti();

        if (!notification) {
            return res.status(500).json({ message: "Notification failed" });
        }

        // 6️⃣ Emit to user
        const io = req.app.get("io");
        io.to(`user_${joinRequest.userId}`).emit("notification", {
            header: notification.header,
            body: notification.body,
            type: notification.type,
            requestId: joinRequest.id
        });

        // 7️⃣ Response
        return res.status(200).json({
            message:
                status === "ACCEPTED"
                    ? "User accepted and added to group"
                    : "User request rejected"
        });

    } catch (error) {
        console.error("sentMemberToFeedBack error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


