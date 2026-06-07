import { PrismaClient } from "../../generated/prisma/index.js";
import { ProjectDto } from "../dto/createProject.dto.js";
import { ResponseDto } from "../dto/response.dto.js";
import { logger } from "../libs/LogGenerator.js";


export class ProjectService {
    private prisma = new PrismaClient();

    async getAllProject(id: number): Promise<ResponseDto> {
        try {
            const result = await this.prisma.project.findMany({
                where: {
                    OR: [
                        { authorId: id },
                        { assignId: id },
                        { assignTo: { assignedUserId: id } },
                        {
                            tasks: {
                                some: {
                                    assignTo: {
                                        assignedUserId: id,
                                    },
                                },
                            },
                        },
                    ],
                },
            });

            if (!result || result.length === 0) {
                return {
                    status: 404,
                    json: { message: "Project not found!" },
                };
            }

            const projectsWithPermission = result.map((project) => {
                const isOwner = project.authorId === id;
                return {
                    ...project,
                    permission: {
                        isOwner,
                        canEdit: isOwner,
                        canDelete: isOwner,
                        canAdd: isOwner,
                    },
                };
            });
            return {
                status: 200,
                json: projectsWithPermission,
            };
        } catch (error) {
            logger.error("ProjectService.getAllproject failed!", {
                userId: id,
                error: error
            })
            return {
                status: 500,
                json: "Internal server error"
            }
        }
    }
    async fetchProjectById(id: number, userId: number): Promise<ResponseDto> {
        try {
            const project = await this.prisma.project.findUnique({
                where: { id: Number(id) },
                include: {
                    tasks: {
                        include: {
                            assignTo: true,
                        },
                    },
                },
            });

            if (!project) {
                return {
                    status: 404,
                    json: { message: "Project not found!" },
                };
            }

            const isProjectOwner = project.authorId === userId;
            const projectPermission = {
                isOwner: isProjectOwner,
                canEdit: isProjectOwner,
                canDelete: isProjectOwner,
                canAddTask: isProjectOwner,
            };

            const tasksWithPermission = project.tasks.map((task) => {
                const isTaskOwner = task?.assignTo?.assignedUserId === userId;
                return {
                    ...task,
                    permission: {
                        isOwner: isTaskOwner || isProjectOwner,
                        canEdit: isTaskOwner || isProjectOwner,
                        canDelete: isProjectOwner,
                        canAdd: isTaskOwner || isProjectOwner,
                    },
                };
            });
            return {
                status: 200,
                json: {
                    ...project,
                    permission: projectPermission,
                    tasks: tasksWithPermission,
                },
            };
        } catch (error) {
            console.log("error on project service of fetch project By Id function");
            return {
                status: 500,
                json: "Internal server error"
            }
        }
    }
    async create(data: ProjectDto, authorId: number): Promise<ResponseDto> {
        try {
            const { name, summary, duration, priority, category } = data;
            if (!name || !summary || !duration) {
                return {
                    status: 400,
                    json: { message: "Project name, summary, and duration are required" },
                };
            }

            const startDate = new Date();
            const endDate = new Date(startDate);
            const totalMonths = Number(duration);
            endDate.setMonth(endDate.getMonth() + totalMonths);

            const project = await this.prisma.project.create({
                data: {
                    name,
                    summary,
                    priority,
                    category,
                    authorId,
                    duration: Number(duration),
                    startDate,
                    endDate,
                },
            });

            return {
                status: 201,
                json: {
                    message: "Project created successfully",
                    project,
                    startDate,
                    endDate,
                },
            };
        } catch (error) {
            logger.error("ProjectService.create failed!", {
                userId: authorId,
                error: error
            });
            return {
                status: 500,
                json: "Internal server error"
            }
        }
    }
    async update(id: number, data: ProjectDto, authorId: number): Promise<ResponseDto> {
        const pid = Number(id);

        try {
            const existing = await this.prisma.project.findFirst({
                where: {
                    id: pid,
                    authorId: authorId
                }
            });

            if (!existing) {
                return {
                    status: 404,
                    json: { message: "Project not found" },
                };
            }

            const { name, summary, duration } = data;

            if (!name?.trim() || !summary?.trim() || duration == null) {
                return {
                    status: 400,
                    json: { message: "Name, summary and duration are required" },
                };
            }

            const isSame =
                name === existing.name &&
                summary === existing.summary &&
                Number(duration) === existing.duration;

            if (isSame) {
                return {
                    status: 200,
                    json: { message: "Nothing changes" },
                };
            }

            if (!existing.startDate) {
                return {
                    status: 400,
                    json: { message: "Project start date is missing" }
                };
            }

            const startDate = existing.startDate;
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + Number(duration));

            await this.prisma.project.update({
                where: { id: pid },
                data: {
                    name,
                    summary,
                    duration: Number(duration),
                    startDate,
                    endDate,
                },
            });

            return {
                status: 200,
                json: { message: "Project updated successfully!" },
            };

        } catch (error) {
            logger.error("ProjectService.update failed!", {
                userId: authorId,
                error: error
            });

            return {
                status: 500,
                json: "Internal server error"
            };
        }
    }
    async updateProjectProgress(projectId: number, authorId: number) {
        const pid = Number(projectId);

        try {
            const result = await this.prisma.task.aggregate({
                where: { projectId: pid },
                _avg: { progress: true },
            });

            const avgProgress = Math.round(result._avg.progress ?? 0);

            await this.prisma.project.update({
                where: { id: pid },
                data: { progress: avgProgress },
            });

            return true;

        } catch (error) {
            logger.error("ProjectService.updateProjectProgress failed!", {
                userId: authorId,
                error: error
            });

            throw error;
        }
    }
}