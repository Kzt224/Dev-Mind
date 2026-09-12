import dotenv from "dotenv";
import { Ollama } from "ollama";

dotenv.config();

export const createOllamaClient = async () => {
    return await new Ollama({
        host: "https://ollama.com",
        headers: {
            Authorization: "Bearer " + process.env.OLLAMA_API_KEY,
        },
    });
};
