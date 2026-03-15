import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

/**
 * getAllnotification()
 */
export const getAllNoti = async (req, res) => {
    try {
        const result = await prisma.notification.findMany({
            where: { authorId: Number(req.user.userId) },
            orderBy: { id: "desc" },
            include: {
                request: true
            }
        });
        return res.status(200).json(result);
    } catch (error) {
        console.log('Error on getAllNoti:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateNotiById = async (req, res) => {
    try {
        const { isRead } = req.body;
        const { id } = req.params;

        const noti = await prisma.notification.findUnique({
            where: { id: Number(id) }
        });

        if (!noti) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (noti.authorId !== Number(req.user.userId)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (noti.read === true) {
            return res.status(200).json({ message: "Notification already read" });
        }

        await prisma.notification.update({
            where: { id: Number(id) },
            data: { read: Boolean(isRead) }
        });

        return res.status(200).json({ message: "Read notification successfully!" });

    } catch (error) {
        console.log('Error on updateNotiById:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

//add noti evidence
export const addNotiEvidence = async (req, res) => {
    try {
        const { notiToken } = req.body;
        const userId = req.user.userId;

        await prisma.notiEvidence.create({
            data: {
                notiToken: notiToken,
                authorId: Number(userId)
            }
        });
        return res.status(200).json({ message: "Notieveidence created successfully!" });
    } catch (error) {
        console.log('Error on noti getAllNoti.js');
        return res.status(500).json("Internal server error");
    }
}

export const deleteNotification = async(req,res) => {
    try {
       const {id} = req.body;
       if(!id) return res.status(400).json({message: "Id is requied"});
       await prisma.notification.deleteMany({
        where: {
            id: {in: id}
        }
       });
       return res.status(200).json({message: "Delete notification successfully"});
    } catch (error) {
        console.log("error on delete notification",error);
    }
}