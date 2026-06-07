import { PrismaClient } from "../../generated/prisma/index.js";
import { checkDate } from "../libs/dateCalculation.js";
import { logger } from "../libs/LogGenerator.js";



export class PrepareApp {
    private prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    private async getAllProject() {
        try {
            const allProject = await this.prisma.project.findMany();
            return allProject;
        } catch (error) {
            throw error;
        }
    }
    private async updateProject() {
        try {
            const project = await this.getAllProject();
            const updateDuration = await checkDate(project);
            for (const data of updateDuration) {
                await this.prisma.project.update({
                    where: { id: data.id },
                    data: {
                        duration: data.diffDays
                    }
                });
            }
            logger.info('Updated project data successfully!');
        } catch (error) {
            throw error;
        }
    }
    private async getAllTask() {
        try {
            const allTask = await this.prisma.task.findMany({
                where: {
                    status:
                    {
                        not: "DONE"
                    }
                }
            });
            return allTask;
        } catch (error) {
            throw error;
        }
    }

    private async updateTask() {
        try {
            const task = await this.getAllTask();
            const updateDuration = await checkDate(task);
            for (const data of updateDuration) {
                const diff = data.diffDays;
                const delay = diff < 0 ? Math.abs(diff) : 0;
                await this.prisma.task.update({
                    where: { id: data.id },
                    data: {
                        duration: diff,
                        delay: delay
                    }
                });
            }
            logger.info("Updated task data successfully!");
        } catch (error) {
            throw error;
        }
    }

    public async run() {
        try {
            await this.updateProject();
            await this.updateTask();
            logger.info('Preparing data successful........');
        } catch (error) {
            throw error;
        }
    }
}