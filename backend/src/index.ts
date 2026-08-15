import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import projectRoute from "./routes/project.route.js";
import taskRoute from "./routes/task.route.js";
import configRoute from "./routes/config.route.js";
import chatRoute from "./routes/chat.route.js";
import cron from "node-cron";
import notiRoute from "./routes/noti.route.js";
import groupRoute from "./routes/team.route.js";
import assignRoute from "./routes/assignTask.route.js";
import userRoute from "./routes/user.route.js";
import { createServer } from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import { PrepareApp } from "./controller/autoLoad.controller.js";
import { SendNotification } from "./controller/notiAutoMation.controller.js";
import { AiInsight } from "./chat/suggest/Ai_Insight.js";
import { decodeToken } from "./libs/jwt.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
    cors: {
        origin: true,
        credentials: true
    }
});
global.io = io;
const autoLoad = new PrepareApp();
const notification = new SendNotification({ socketIo: io });
app.set("io", io);
app.use(cors({
    credentials: true,
    origin: true
}));
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/data", projectRoute);
app.use("/api/data", taskRoute);
app.use("/api/message", chatRoute);
app.use("/api/data", notiRoute);
app.use("/api/data", groupRoute);
app.use("/api/data", assignRoute);
app.use("/api/data", userRoute);
app.use("/", configRoute);

const onlineUser = new Map<number, Set<string>>();
const disconnectTimers = new Map<number, NodeJS.Timeout>();

io.on("connection", async (socket) => {
    try {
        console.log("User connected:", socket.id);
        const token = socket.handshake.query.token as string;
        if (!token) {
            socket.disconnect();
            return;
        }
        const result: any = await decodeToken(token);
        if (!result?.userId) {
            socket.disconnect();
            return;
        }
        socket.data.userId = result.userId;
        const userId = result.userId;
        if (disconnectTimers.has(userId)) {
            clearTimeout(disconnectTimers.get(userId)!);
            disconnectTimers.delete(userId);
        }
        if (!onlineUser.has(userId)) {
            onlineUser.set(userId, new Set());
        }
        onlineUser.get(userId)!.add(socket.id);
        io.emit("online-users", [...onlineUser.keys()]);
        try {
            const aiInsight = new AiInsight(socket.data.userId);
            const insight = await aiInsight.start();

            socket.emit("daily-insight", {
                message: insight
            });
        } catch (error) {
            console.error(error);
        }

        socket.on("disconnect", () => {
            const sockets = onlineUser.get(userId);

            if (sockets) {
                sockets.delete(socket.id);
                if (sockets?.size === 0) {
                    disconnectTimers.set(
                        userId,
                        setTimeout(() => {
                            const currentSockets = onlineUser.get(userId);
                            if (!currentSockets || currentSockets.size === 0) {
                                onlineUser.delete(userId);
                                io.emit("user-offline", userId);
                            }
                            disconnectTimers.delete(userId);
                        }, 10000))
                }
            }
            console.log("User disconnected:", socket.id);
            io.emit("online-users", [...onlineUser.keys()]);
        });
    } catch (error) {
        console.error(error);
        socket.disconnect();
    }
});


httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

cron.schedule("36 21 * * *", async () => {
    console.log("Running daily autoLoad...");
    await autoLoad.run();
    console.log("Sending Notification...");
    await notification.sendNotification();
    //later notificaction with socket method is need tochange
});