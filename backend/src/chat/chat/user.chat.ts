import { Ollama } from "ollama";
import dotenv from "dotenv";

import { Request, Response } from "express";
import { TaskService } from "../../services/taskServies.js";
import { ProjectService } from "../../services/projectService.js";

dotenv.config();

export const createOllamaClient = (): Ollama => {
    return new Ollama({
        host: "https://ollama.com",
        headers: {
            Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
        },
    });
};

// Intent types (important for safety)
type Intent =
    | "TASK_STATUS"
    | "DEADLINE"
    | "PROJECT_SUMMARY"
    | "GENERAL";

// --------------------
// CLASSIFY INTENT
// --------------------
const classifyIntent = async (
    ollama: Ollama,
    content: string
): Promise<Intent> => {
    const prompt = `
Analyze the user input and return ONLY one of the following labels:
- TASK_STATUS: query about task progress or status.
- DEADLINE: query about due dates.
- PROJECT_SUMMARY: project overview or stats.
- GENERAL: anything else.

User input: "${content}"
Label:`;

    const response = await ollama.generate({
        model: "gpt-oss:120b-cloud",
        prompt,
        stream: false,
        options: { temperature: 0, stop: ["\n"] },
    });

    return response.response.trim() as Intent;
};

// --------------------
// MAIN CONTROLLER
// --------------------
export const chatWithAI = async (req: Request, res: Response) => {
    try {
        const { content } = req.query as { content?: string };
        const taskService = new TaskService();
        const projectService = new ProjectService();
        if (!content) {
            return res.status(400).json({ error: "content required" });
        }

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const ollama = createOllamaClient();
        const intent = await classifyIntent(ollama, content);

        let dbContext = "";

        const userId = Number((req as any)?.user?.userId);

        switch (intent) {
            case "TASK_STATUS": {
                const tasks = await taskService.getAllTask(userId);
                dbContext = `DATABASE_CONTEXT (Tasks): ${JSON.stringify(tasks)}`;
                break;
            }

            case "DEADLINE": {
                const deadlines = await taskService.getAllTask(userId);
                dbContext = `DATABASE_CONTEXT (Deadlines): ${JSON.stringify(deadlines)}`;
                break;
            }

            case "PROJECT_SUMMARY": {
                const summary = await projectService.getAllProject(userId);
                dbContext = `DATABASE_CONTEXT (Summary Stats): ${JSON.stringify(summary)}`;
                break;
            }

            default:
                dbContext = "No specific database context needed.";
                break;
        }

        const messages = [
            {
                role: "system",
                content: `You are 'Dev Mind AI', a specialized Assistant built by a Senior Developer.
Your purpose is to help manage tasks, review Prisma schemas, and optimize Node.js code.

${dbContext ? `IMPORTANT DATA FROM DB: ${dbContext}` : ""}

Be concise, technical, and helpful.`,
            },
            {
                role: "user",
                content,
            },
        ];

        const response = await ollama.chat({
            model: "gpt-oss:120b-cloud",
            messages,
            stream: true,
        });

        for await (const chunk of response) {
            const token = chunk?.message?.content;
            if (token) {
                res.write(`data: ${token}\n\n`);
            }
        }

        res.write("data: [END]\n\n");
        res.end();
    } catch (error) {
        console.error("AI Error:", error);
        res.end();
    }
};