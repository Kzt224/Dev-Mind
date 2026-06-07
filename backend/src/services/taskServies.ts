import { Prisma, PrismaClient, Status } from "../../generated/prisma/index.js";
import { Request, Response } from "express";
import { CreateTask } from "../dto/createTask.dto.js";
import { ResponseDto } from "../dto/response.dto.js";
import { container } from "../container/index.js";
import { logger } from "../libs/LogGenerator.js";
import { UpdateTask } from "../dto/updateTask.dto.js";
import { SendNotification } from "../controller/notiAutoMation.controller.js";

export class TaskService {
    private prisma = new PrismaClient();

    async createTask(data: CreateTask, authorId: number): Promise<ResponseDto> {
        try {
            const { name, startDate, endDate, reason, note, projectId } = data;

            if (!name || !startDate || !endDate) {
                return { status: 400, json: { message: "Name, start date, and end date are required!" } };
            }

            const start = new Date(startDate);
            const end = new Date(endDate);
            const now = new Date();
            const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            const delayDays = now > end ? Math.ceil((now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24)) : 0;

            const result = await this.prisma.task.create({
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
            const projectService = container.get('projectService');
            await projectService.updateProjectProgress(projectId, authorId);
            return { status: 201, json: { message: "Task created successfully!", task: result } };
        } catch (error) {
            logger.error("TaskService.createTask failed!", {
                userId: authorId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
    async getAllTask(userId: number): Promise<ResponseDto> {
        try {
            const result = await this.prisma.task.findMany({
                where: {
                    OR: [
                        { authorId: userId },
                        { assignTo: { assignedUserId: userId } },
                    ],
                },
                include: {
                    project: { select: { name: true } },
                },
                orderBy: {
                    status: "desc",
                },
            });

            if (!result || result.length === 0) {
                return { status: 404, json: { message: "Task not found!" } };
            }
            return { status: 200, json: result };
        } catch (error) {
            logger.error("TaskService.getAllTask failed!", {
                userId: userId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
    async getTaskById(id: number, authorId: number): Promise<ResponseDto> {
        try {
            const task = await this.prisma.task.findUnique({
                where: { id: Number(id) },
                include: {
                    project: { select: { name: true } },
                    assignTo: { select: { assignUser: { select: { name: true } } } },
                },
            });

            if (!task) {
                return { status: 404, json: { message: "Task not found!" } };
            }

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
                assignTo: task.assignTo?.assignUser?.name || null,
            };

            return { status: 200, json: result };
        } catch (error) {
            logger.error("TaskService.getTaskById failed!", {
                userId: authorId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
    async deleteTask(id: number, authorId: number): Promise<ResponseDto> {
        try {
            const task = await this.prisma.task.findUnique({ where: { id: Number(id) }, select: { projectId: true } });
            if (!task) {
                return { status: 404, json: { message: "Task not found" } };
            }

            await this.prisma.task.delete({ where: { id: Number(id) } });
            const projectService = container.get('projectService');
            await projectService.updateProjectProgress(task.projectId, authorId);

            return { status: 200, json: { message: "Task deleted successfully!" } };
        } catch (error) {
            logger.error("TaskService.deleteTask failed!", {
                userId: authorId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }

    async modifyTask(id: number, data: UpdateTask, authorId: number, io: any): Promise<ResponseDto> {
        try {
            const { name, reason, note, startDate, endDate, progress } = data;
            const task = await this.prisma.task.findUnique({ where: { id: Number(id) } });
            if (!task) {
                return { status: 404, json: { message: "Task not found" } };
            }

            if (!name && !startDate && !endDate && progress === undefined) {
                return { status: 400, json: { message: "At least one field is required" } };
            }
            if (progress !== undefined) {
                if (progress > 100) {
                    return { status: 400, json: { message: "Progress cannot exceed 100" } };
                }
                if (progress < task.progress) {
                    return { status: 400, json: { message: "Progress cannot decrease" } };
                }
            }
            const start = new Date(startDate ?? task.startDate!);
            const end = new Date(endDate ?? task.endDate!);
            const durationDays = Math.ceil((end.getTime() - start?.getTime()) / (1000 * 60 * 60 * 24));

            let status: Status = this.calculateProgress(data.progress ?? task.progress);

            const updateTask = await this.prisma.$transaction(async (tx) => {
                const updated = await this.prisma.task.update({
                    where: { id: Number(id) },
                    data: {
                        name: name ?? undefined,
                        progress: progress !== undefined ? Number(progress) : undefined,
                        status: status,
                        duration: durationDays,
                        reason: reason ?? undefined,
                        note: note ?? undefined,
                        startDate: startDate ? new Date(startDate) : undefined,
                        endDate: endDate ? new Date(endDate) : undefined,
                    }
                });
                const modTracker = await tx.modTracker.upsert({
                    where: { updateUserId: Number(authorId) },
                    update: { updatedAt: new Date() },
                    create: {
                        type: "TASK",
                        updateUserId: Number(authorId),
                        project: { connect: { id: task.projectId } }
                    }
                });
                const finalTask = await tx.task.update({
                    where: { id: updated.id },
                    data: { modifyTestId: modTracker.id }
                });
                const projectService = container.get('projectService');
                await projectService.updateProjectProgress(task.projectId, authorId, tx);
                return finalTask;
            })
            this.handleTaskNotifications(io, task, updateTask, authorId);
            return { status: 200, json: { message: "Task updated successfully", data: updateTask } };
        } catch (error) {
            logger.error("TaskService.deleteTask failed!", {
                userId: authorId,
                error: error
            });
            return {
                status: 500,
                json: { message: "Internal server error" }
            }
        }
    }
    private calculateProgress(progress: number) {
        if (progress === 100) return Status.DONE;
        else if (progress > 0 && progress < 100) return Status.PROCESSING;
        else return Status.WAITING;
    }
    private async handleTaskNotifications(io: any, task: any, updateTask: any, authorId: number) {
        if (!io) return;
        const notiService = new SendNotification({ socketIo: io });
        const editorId = Number(authorId);
        const assignTrack = task.assignId ? await this.prisma.assignTrack.findUnique({ where: { id: Number(task.assignId) } }) : null;
        const assignedUserId = assignTrack?.assignedUserId;
        if (editorId === task.authorId && assignedUserId) {
            await this.emitNoti(io, notiService, assignedUserId, editorId, updateTask, task.projectId);
        }
        else if (assignedUserId && editorId === assignedUserId) {
            await this.emitNoti(io, notiService, task.authorId, editorId, updateTask, task.projectId);
        }
    }
    private async emitNoti(io: any, service: any, recipientId: number, modifierId: number, task: any, projectId: number) {
        const notification = await service.sendModifyNoti({
            recipientId,
            modifierId,
            taskId: task.id,
            projectId,
            taskName: task.name,
        });

        if (notification) {
            io.to(`user_${recipientId}`).emit("notification", notification);
        }
    }
    async getTaskSummary(userId: number): Promise<ResponseDto> {
        try {
            const currentDay = new Date();
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(currentDay.getDate() + 7);
            const [nearDeadLineCount, delayCount, completeCount] = await Promise.all([
                this.prisma.task.count({
                    where: {
                        OR: [
                            { authorId: userId },
                            {
                                assignTo: {
                                    assignedUserId: userId
                                }
                            }
                        ],
                        status: { not: "DONE" },
                        endDate: { gte: currentDay, lte: sevenDaysFromNow }
                    }
                }),
                this.prisma.task.count({
                    where: {
                        OR: [
                            { authorId: userId },
                            {
                                assignTo: {
                                    assignedUserId: userId
                                }
                            }
                        ],
                        status: { not: "DONE" }
                    }
                }),
                this.prisma.task.count({
                    where: {
                        OR: [
                            { authorId: userId },
                            {
                                assignTo: {
                                    assignedUserId: userId
                                }
                            }
                        ],
                        status: "DONE"
                    }
                })
            ]);
            return {
                status: 200,
                json: {
                    nearDeadLineCount: nearDeadLineCount,
                    delayCount: delayCount,
                    completeCount: completeCount
                }
            }
        } catch (error) {
            logger.error("TaskService.getTaskSummary failed!", {
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