import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import projectRoute from "./routes/project.route.js";
import taskRoute from "./routes/task.route.js";
import configRoute from "./routes/config.route.js";
import chatRoute from "./routes/chat.route.js";
import prepareApp from "./controller/autoLoad.controller.js";
import cron from "node-cron";
import notiRoute from "./routes/noti.route.js";
import SendNotification from "./controller/notiAutoMation.controller.js";
import groupRoute from "./routes/team.route.js";
import assignRoute from "./routes/assignTask.route.js";
import userRoute from "./routes/user.route.js";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();
const PORT = process.env.PORT;
const app = new express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: true,
        credentials: true
    }
});

global.io = io;

const autoLoad = new prepareApp();
const notification = new SendNotification();
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
app.use("/api/data",assignRoute);
app.use("/api/data",userRoute);
app.use("/", configRoute);

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});


httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

cron.schedule("10 21 * * *", async () => {
    console.log("Running daily autoLoad...");
    await autoLoad.run();
    console.log("Sending Notification...");
    await notification.sendNotification({socketIo: io});
    //later notificaction with socket method is need tochange
});