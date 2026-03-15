import { PrismaClient } from "../../generated/prisma/index.js";
import SendNotification from "./notiAutoMation.controller.js";

const prisma = new PrismaClient();
export const assignTask = async (req, res) => {
    try {
        const { projectId, taskId, assignUserId } = req.body;
        const userId = req.user.userId;

        if (!projectId || !taskId || !assignUserId)
            return res.status(400).json({ message: "Require projectId, taskId, and assignUserId" });
        // get task
        const task = await prisma.task.findUnique({
            where: { id: Number(taskId) }
        });
        if (!task) return res.status(404).json({ message: "Task not found" });

        // validation: check if task already assigned
        if (task.assignId) {
            return res.status(400).json({ message: "This task is already assigned" });
        }

        if (task.authorId !== userId)
            return res.status(400).json({ message: "Admin only can assign" });

        if (task.status === "DONE")
            return res.status(400).json({ message: "This task is already done, can't assign" });

        // check project exists
        const project = await prisma.project.findUnique({
            where: { id: Number(projectId) },
            select: { name: true }
        });
        if (!project) return res.status(404).json({ message: "Project not found" });

        // create assign track
        await prisma.assignTrack.create({
            data: {
                project: { connect: { id: Number(projectId) } },
                task: { connect: { id: Number(taskId) } },
                assignUser: { connect: { id: Number(assignUserId) } }
            }
        });
        // send notification for assigned member
        try {
            const noti = new SendNotification({ socketIo: req.app.get("io") });
            const notification = await noti.sendAssignNoti({
                memberId: assignUserId,
                authorId: userId,
                taskId: taskId,
                projectId: projectId,
                taskName: task.name
            });
            if (notification) {
                const io = req.app.get("io");
                io.to(`user_${assignUserId}`).emit("notification", {
                    header: notification.header,
                    body: notification.body,
                    type: notification.type,
                    taskId: notification.taskId
                });
            }
        } catch (error) {
            console.error("Error sending notification:", error);
        }
        return res.status(200).json({ message: `${task.name} assigned successfully!` });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}
