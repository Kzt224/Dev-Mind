import { PrismaClient } from "../../generated/prisma/index.js";


const prisma = new PrismaClient();
export const createProject = async (req, res) => {
    try {
        const { name, summary, authorId, duration } = req.body;

        if (!name || !summary || !duration) {
            return res.status(400).json({ message: "Project name, summary, and duration are required" });
        }

        const startDate = new Date();

        const endDate = new Date(startDate);
        const totalMonths = parseInt(duration);

        endDate.setMonth(endDate.getMonth() + totalMonths);

        await prisma.project.create({
            data: {
                name,
                summary,
                authorId,
                duration: Number(duration),
                startDate,
                endDate,
            },
        });

        return res.status(200).json({
            message: "Project created successfully",
            startDate,
            endDate,
        });
    } catch (error) {
        console.error("Error on createProject function", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const getProject = async (req, res,internal = false) => {
    try {
        const userId = Number(req.user.userId);
        const result = await prisma.project.findMany({
            where: {
                OR: [
                    { authorId: userId },
                    { assignId: userId },
                    {
                        assignTo: {
                            assignedUserId: userId
                        }
                    },
                    {
                        tasks: {
                            some: {
                                assignTo: {
                                    assignedUserId: userId
                                }
                            }
                        }
                    }
                ]
            },
        });
        if (result.length === 0){
            if(internal) return [];
            return res.status(404).json({ message: "Project not found!" });
        } 
        const projectsWithPermission = result?.map(project => {
            const isOwner = project.authorId === userId;
            return {
                ...project,
                permission: {
                    isOwner,
                    canEdit: isOwner,
                    canDelete: isOwner,
                    canAdd: isOwner
                }
            };
        });
        if(internal) return projectsWithPermission;
        return res.status(200).json({
            result: projectsWithPermission
        });
    } catch (error) {
        console.log("Error on getProject function", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = Number(req.user.userId);

        // Fetch project with tasks
        const project = await prisma.project.findUnique({
            where: { id: Number(id) },
            include: {
                tasks: {
                    include: {
                        assignTo: true // assigned user info
                    }
                }
            }
        });

        if (!project) 
            return res.status(404).json({ message: "Project not found!" });

        const isProjectOwner = project.authorId === userId;
        const projectPermission = {
            isOwner: isProjectOwner,
            canEdit: isProjectOwner,
            canDelete: isProjectOwner,
            canAddTask: isProjectOwner
        };

        const tasksWithPermission = project.tasks.map(task => {
            const isTaskOwner = task.assignTo?.assignedUserId === userId;
            return {
                ...task,
                permission: {
                    isOwner: isTaskOwner || isProjectOwner, // project owner can edit all
                    canEdit: isTaskOwner || isProjectOwner,
                    canDelete: isProjectOwner,
                    canAdd: isTaskOwner || isProjectOwner
                }
            };
        });

        // Final response
        return res.status(200).json({
            result: {
                ...project,
                permission: projectPermission,
                tasks: tasksWithPermission
            }
        });

    } catch (error) {
        console.error("Error on getProjectById function", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const editProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, summary, duration } = req.body;

        if (!name || !summary || !duration)
            return res.status(400).json({ message: "All fields are required" });

        const existing = await prisma.project.findUnique({
            where: { id: Number(id) }
        });

        if (!existing) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (
            name === existing.name &&
            summary === existing.summary &&
            Number(duration) === existing.duration
        ) {
            return res.status(200).json({ message: "Nothing changes" });
        }

        const startDate = existing.startDate;
        let endDate = existing.endDate;

        if (duration) {
            endDate = new Date(startDate);
            const totalMonths = parseInt(duration);
            endDate.setMonth(endDate.getMonth() + totalMonths);
        }

        await prisma.project.update({
            where: { id: Number(id) },
            data: {
                name,
                summary,
                duration: Number(duration),
                startDate,
                endDate
            }
        });
        return res
            .status(200)
            .json({ message: "Project updated successfully!" });

    } catch (error) {
        console.error("Error on project update function", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const updateProjectProgress = async (projectId) => {
    try {
        const totalTasks = await prisma.task.count({
            where: { projectId: Number(projectId) }
        });

        if (totalTasks === 0) {
            await prisma.project.update({
                where: { id: Number(projectId) },
                data: { progress: 0 }
            });
            return;
        }

        const sumResult = await prisma.task.aggregate({
            where: { projectId: Number(projectId) },
            _sum: { progress: true }
        });

        const totalProgress = sumResult._sum.progress || 0;
        const avgProgress = totalProgress / totalTasks;

        await prisma.project.update({
            where: { id: Number(projectId) },
            data: { progress: avgProgress }
        });

    } catch (error) {
        console.log("Error updating project progress", error);
        throw error;
    }
};

