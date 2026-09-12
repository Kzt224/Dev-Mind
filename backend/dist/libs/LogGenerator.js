import * as fs from "fs";
import * as path from "path";
class Log {
    outputPath = path.join(process.cwd(), "logs");
    write(level, message, context) {
        if (!fs.existsSync(this.outputPath)) {
            fs.mkdirSync(this.outputPath, { recursive: true });
        }
        const time = new Date().toISOString();
        let logLine = `[${time}] [${level}] ${message}`;
        if (context) {
            const ctx = Object.entries(context)
                .map(([k, v]) => `${k}=${v}`)
                .join(" ");
            logLine += ` | ${ctx}`;
        }
        logLine += "\n";
        const filePath = path.join(this.outputPath, `${level.toLowerCase()}.log`);
        fs.appendFileSync(filePath, logLine, "utf8");
    }
    info(message, context) {
        this.write("INFO", message, context);
    }
    error(message, context) {
        this.write("ERROR", message, context);
    }
    warn(message, context) {
        this.write("WARN", message, context);
    }
    debug(message, context) {
        if (process.env.NODE_ENV !== "production") {
            this.write("DEBUG", message, context);
        }
    }
}
export const logger = new Log();
