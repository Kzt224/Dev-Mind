import dotenv from "dotenv";
import { TaskService } from "../../services/taskServies.js";
import { ProjectService } from "../../services/projectService.js";
import { createOllamaClient } from "../vendor/ollama.js";
dotenv.config();
// --------------------
// CLASSIFY INTENT
// --------------------
const classifyIntent = async (agent, content) => {
    const prompt = `
Analyze the user input and return ONLY one of the following labels:
- TASK_STATUS: query about task progress or status.
- DEADLINE: query about due dates.
- PROJECT_SUMMARY: project overview or stats.
- GENERAL: anything else.

User input: "${content}"
Label:`;
    const response = await agent.generate({
        model: "gpt-oss:120b-cloud",
        prompt,
        stream: false,
        options: { temperature: 0, stop: ["\n"] },
    });
    return response.response.trim();
};
export const chatWithAI = async (req, res) => {
    try {
        const { content } = req.query;
        const taskService = new TaskService();
        const projectService = new ProjectService();
        if (!content) {
            return res.status(400).json({ error: "content required" });
        }
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        const agent = await createOllamaClient();
        const intent = await classifyIntent(agent, content);
        let dbContext = "";
        const userId = Number(req?.user?.userId);
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
        const response = await agent.chat({
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
    }
    catch (error) {
        console.error("AI Error:", error);
        res.end();
    }
};
