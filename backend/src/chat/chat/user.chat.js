import { Ollama } from "ollama";
import dotenv from "dotenv";
import { getAllTask } from "../../controller/task.controller.js";
import { getProject } from "../../controller/project.controller.js";

dotenv.config();

export const createOllamaClient = () => {
  return new Ollama({
    host: "https://ollama.com",
    headers: {
      Authorization: "Bearer " + process.env.OLLAMA_API_KEY
    }
  });
};
// New helper to classify intent
const classifyIntent = async (ollama, content) => {
  const prompt = `
    Analyze the user input and return ONLY one of the following labels:
    - TASK_STATUS: query about progress or if a task is done or how many task or anything ask about task.
    - DEADLINE: query about when something is due.
    - PROJECT_SUMMARY: asking for an overview of the project or how many project or anything ask about project.
    - GENERAL: anything else (technical help, code review, chat).

    User input: "${content}"
    Label:`;

  const response = await ollama.generate({
    model: "gpt-oss:120b-cloud", 
    prompt: prompt,
    stream: false,
    options: { temperature: 0, stop: ["\n"] } 
  });

  return response.response.trim();
};
export const chatWithAI = async (req, res) => {
  try {
    const { content, context } = req.query;
    if (!content) return res.status(400).json({ error: "content required" });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const ollama = createOllamaClient();
    const intent = await classifyIntent(ollama, content);
    
    let dbContex = '';

    // FIX: Switch case should just be the string value
    switch (intent) {
      case "TASK_STATUS":
        const tasks = await getAllTask(req, res, true); // true = internal return
        dbContex = `DATABASE_CONTEXT (Tasks): ${JSON.stringify(tasks)}`;
        break;

      case "DEADLINE":
        const deadlines = await getAllTask(req, res, true);
        dbContex = `DATABASE_CONTEXT (Deadlines): ${JSON.stringify(deadlines)}`;
        break;

      case "PROJECT_SUMMARY":
        const summary = await getProject(req, res, true);
        dbContex = `DATABASE_CONTEXT (Summary Stats): ${JSON.stringify(summary)}`;
        break;

      default:
        dbContex = "No specific database context needed.";
        break;
    }

    // 2. Inject context into the System Message
    const messages = [
      {
        role: "system",
        content: `You are 'Dev Mind AI', a specialized Assistant built by a Senior Developer.
Your purpose is to help manage tasks, review Prisma schemas, and optimize Node.js code.
You are currently integrated into the 'Developer Mind' app.

${dbContex !== "" ? `IMPORTANT DATA FROM DB: ${dbContex}` : ""}
Be concise, technical, and helpful. When provided with memory, integrate it but don't echo it back.`
      }
    ];


    messages.push({ role: 'user', content: content });

    const response = await ollama.chat({
      model: "gpt-oss:120b-cloud",
      messages,
      stream: true
    });

    for await (const chunk of response) {
      const token = chunk?.message?.content;
      res.write(`data: ${token}\n\n`);
    }

    res.write("data: [END]\n\n");
    res.end();

  } catch (error) {
    console.error("AI Error:", error);
    res.end();
  }
};
