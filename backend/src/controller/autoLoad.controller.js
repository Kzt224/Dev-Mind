import { PrismaClient } from "../../generated/prisma/index.js";
import { checkDate } from "../libs/dateCaculation.js";


class prepareApp {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async getAllProject() {
        try {
            const allProject = await this.prisma.project.findMany();
            return allProject;
        } catch (error) {
            throw error;
        }
    }

    async updateProject() {
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
            console.log('Updated project data successfully!');
        } catch (error) {
            throw error;
        }
    }

    async getAllTask() {
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

    async updateTask() {
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
            console.log("Updated task data successfully!");
        } catch (error) {
            throw error;
        }
    }


    async run() {
        try {
            await this.updateProject();
            await this.updateTask();
            console.log('Preparing data successful........');
        } catch (error) {
            throw error;
        }
    }
}


export default prepareApp;