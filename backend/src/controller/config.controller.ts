import { Request, Response } from "express"
import path from "node:path";
import { fileURLToPath } from "node:url"
import fs from "fs";

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

export const loadConfig = async (req: Request, res: Response) => {
    try {
        const env = process.env.NODE_ENV;
        const filePath = path.join(
            __dirName,
            "..",
            "..",
            "config",
            env === "production" ? "config.json" : "config.dev.json"
        );
        try {
            const data = fs.readFileSync(filePath, "utf-8");
            const config = JSON.parse(data);
            return res.status(200).json(config);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}