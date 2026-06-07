import * as fs from "fs";
import * as path from "path";

type LogLevel = "INFO" | "ERROR" | "WARN" | "DEBUG";

class Log {
  private outputPath = path.join(process.cwd(), "logs");

  private write(level: LogLevel, message: string, context?: Record<string, any>) {
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

  info(message: string, context?: Record<string, any>) {
    this.write("INFO", message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.write("ERROR", message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.write("WARN", message, context);
  }

  debug(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV !== "production") {
      this.write("DEBUG", message, context);
    }
  }
}

export const logger = new Log();