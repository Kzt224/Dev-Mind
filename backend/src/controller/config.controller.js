import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadConfig = async (req, res) => {
   try {
      const env = process.env.NODE_ENV;
      const filePath = path.join(
         __dirname,         
         "..",
         "..",               
         "config",
         env === "production" ? "config.json" : "config.dev.json"
      );
      try {
         const data = fs.readFileSync(filePath);
         res.json(JSON.parse(data));
      } catch (error) {
         console.error(error);
      }
   } catch (error) {
      console.error(error);
   }
}
