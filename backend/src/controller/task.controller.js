import { PrismaClient } from "../../generated/prisma/index.js";
import { updateProjectProgress } from "./project.controller.js";
import SendNotification from "./notiAutoMation.controller.js";

const prisma = new PrismaClient();

export const createTask = async (req, res) => {
  try {
    const { name, startDate, endDate, reason, note, authorId, projectId } = req.body;
    if (!name || !startDate || !endDate) {
      return res.status(400).json({
        message: "Name, start date, and end date are required!",
      });
    }
    // Convert string to Date object
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    // Calculate duration (in days)
    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    // If already past due date, calculate delay
    const delayDays = now > end ? Math.ceil((now - end) / (1000 * 60 * 60 * 24)) : 0;
    // Create new task in Prisma
    const result = await prisma.task.create({
      data: {
        name,
        startDate: start,
        endDate: end,
        duration: durationDays,
        delay: delayDays,
        reason,
        note,
        authorId: Number(authorId),
        projectId: Number(projectId),
      },
    });
    await updateProjectProgress(projectId);
    return res.status(201).json({
      message: "Task created successfully!",
      task: result,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const modifyTask = async (req, res) => {
  try {
    const { name, reason, note, progress, startDate, endDate } = req.body;
    const { id } = req.params;
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!name && !startDate && !endDate && progress === undefined)
      return res.status(400).json({ message: "At least one field is required" });

    if (progress !== undefined) {
      if (progress > 100)
        return res.status(400).json({ message: "Progress cannot exceed 100" });

      if (progress < task.progress)
        return res.status(400).json({ message: "Progress cannot decrease" });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    let status = '';
    if (progress == 100) status = 'DONE';
    else if (progress > 0 && progress < 100) status = 'PROCESSING';
    else status = 'WAITING';

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (reason !== undefined) updateData.reason = reason;
    if (note !== undefined) updateData.note = note;
    if (progress !== undefined) updateData.progress = Number(progress);
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;

    updateData.status = status;
    updateData.duration = durationDays;
    const updateTask = await prisma.task.update({
      where: { id: Number(id) },
      data: updateData
    });
    await updateProjectProgress(task.projectId);

    // store modification in ModTracker and link to task
    try {
      let modTracker;
      try {
        modTracker = await prisma.modTracker.create({
          data: {
            type: 'TASK',
            updateUserId: Number(req.user.userId),
            project: { connect: { id: task.projectId } }
          }
        });
        await prisma.task.update({ where: { id: updateTask.id }, data: { modifyTestId: modTracker.id } });
      } catch (e) {
        // handle unique constraint on updateUserId by updating existing ModTracker
        if (e && (e.code === 'P2002' || /unique/i.test(String(e.message || '')))) {
          const existing = await prisma.modTracker.findUnique({ where: { updateUserId: Number(req.user.userId) } });
          if (existing) {
            modTracker = await prisma.modTracker.update({ where: { updateUserId: Number(req.user.userId) }, data: { updatedAt: new Date() } });
            await prisma.task.update({ where: { id: updateTask.id }, data: { modifyTestId: modTracker.id } });
          }
        } else {
          console.error('ModTracker create error:', e);
        }
      }
    } catch (err) {
      console.error('Error storing ModTracker:', err);
    }

    // send notification conditionally: admin edits -> notify assignee; assignee edits -> notify admin
    try {
      const notiService = new SendNotification({ socketIo: req.app.get("io") });
      const io = req.app.get("io");
      const editorId = Number(req.user.userId);

      // fetch assign track if exists
      const assignTrack = task.assignId ? await prisma.assignTrack.findUnique({ where: { id: Number(task.assignId) } }) : null;
      const assignedUserId = assignTrack?.assignedUserId;

      if (editorId === task.authorId) {
        // admin edited -> notify assigned user only
        if (assignedUserId) {
          const notificationAssignee = await notiService.sendModifyNoti({
            recipientId: assignedUserId,
            modifierId: editorId,
            taskId: updateTask.id,
            projectId: task.projectId,
            taskName: updateTask.name,
          });
          if (notificationAssignee) {
            io.to(`user_${assignedUserId}`).emit("notification", {
              header: notificationAssignee.header,
              body: notificationAssignee.body,
              type: notificationAssignee.type,
              taskId: notificationAssignee.taskId,
            });
          }
        }
      } else if (assignedUserId && editorId === assignedUserId) {
        // assigned user edited -> notify admin/author only
        const notificationAuthor = await notiService.sendModifyNoti({
          recipientId: task.authorId,
          modifierId: editorId,
          taskId: updateTask.id,
          projectId: task.projectId,
          taskName: updateTask.name,
        });
        if (notificationAuthor) {
          io.to(`user_${task.authorId}`).emit("notification", {
            header: notificationAuthor.header,
            body: notificationAuthor.body,
            type: notificationAuthor.type,
            taskId: notificationAuthor.taskId,
          });
        }
      }
    } catch (err) {
      console.error("Error sending modify notifications:", err);
    }

    return res.status(200).json({ message: "Task updated successfully", data: updateTask });
  } catch (error) {
    console.log("Error on modify task", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTask = async (req, res, internal = false) => {
  try {
    const userId = Number(req.user.userId);
    const result = await prisma.task.findMany({
      where: {
        OR: [
          { authorId: userId },
          {
            assignTo: {
              assignedUserId: userId
            }
          }
        ]
      },
      include: {
        project: {
          select: { name: true }
        }
      },
      orderBy: {
        status: "desc"
      }
    });
    if (!result) {
      if(internal) return [];
      return res.status(404).json({ message: "Task not found!" });
    }
    if(internal) return result;
    return res.status(200).json(result);
  } catch (error) {
    console.log("error on get all task", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        project: {
          select: { name: true }
        },
        assignTo: {
          select: {
            assignUser: {
              select: { name: true }
            }
          }
        }
      }
    });
    console.log(task);
    const result = {
      name: task.name,
      startDate: task.startDate,
      endDate: task.endDate,
      duration: task.duration,
      delay: task.delay,
      reason: task.reason,
      status: task.status,
      note: task.note,
      progress: task.progress,
      project: task.project,
      assignTo: task?.assignTo?.assignUser?.name || null
    }
    if (!result) return res.status(404).json({ message: "Task not found!" });
    return res.status(200).json(result);
  } catch (error) {
    console.log("Error on get Task by id function", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
      select: { projectId: true }
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await prisma.task.delete({
      where: { id: Number(id) }
    });
    await updateProjectProgress(task.projectId);
    return res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    console.log("Error on delete task function", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
