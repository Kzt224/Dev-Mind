import { PrismaClient } from "../../../generated/prisma/index.js";
import { TaskService } from "../../services/taskServies.js"
import { createOllamaClient } from "../chat/user.chat.js";

interface summeryInterface {
    hithPriorityList: number;
    delayList: number;
    nearDeadLine: number;
    complete: number;
}
interface storeData {
    userId: number,
    date: string,
    content: string
}
export class AiInsight {
    public userId: number;
    public prisma = new PrismaClient();
    private summery: summeryInterface = {
        hithPriorityList: 0,
        delayList: 0,
        nearDeadLine: 0,
        complete: 0
    };
    constructor(userId: number) {
        this.userId = userId;
    }
    private getSummary = async () => {
        const taskServie = new TaskService();
        this.summery = (await taskServie.getTaskSummary(this.userId))?.json;
    }
    private getPrompt = async () => {
        const prompt = `
                You are an AI assistant for a productivity app.

                Generate ONE short daily insight.

                Rules:
                - Maximum 20 words
                - One sentence only
                - Friendly tone
                - No markdown
                - No bullet points
                - No quotation marks
                - Focus on productivity or urgency

                Task Summary:
                ${JSON.stringify(this.summery)}
                `;
        return prompt;
    }

    private generateAIInsight = async () => {
        const prompt = await this.getPrompt();
        const ollama = createOllamaClient();
        const response = await ollama.chat({
            model: "gpt-oss:120b-cloud",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            stream: false
        });
        return response.message.content;
    }
    private checkAlreadyInsight = async () => {
        const today = new Date().toISOString().split("T")[0];
        let insight = await this.prisma.aiInsight.findFirst({
            where: {
                userId: this.userId,
                date: today
            }
        });
        if (insight) {
            return insight;
        };
    }

    private createAiInsight = async (data: storeData) => {
        await this.prisma.aiInsight.create({ data: data });
    }
    public start = async () => {
        await this.getSummary();
        const aiInsight = await this.checkAlreadyInsight();
        if (aiInsight) {
            return aiInsight.content;
        } else {
            const date = new Date().toISOString().split("T")[0];
            const response = await this.generateAIInsight();
            await this.createAiInsight({
                userId: this.userId,
                date: date,
                content: response
            });
            return response;
        }
    }
}
