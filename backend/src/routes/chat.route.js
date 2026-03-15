import express from "express";
import { chatWithAI } from "../chat/chat/user.chat.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/chat/stream",checkAuth,chatWithAI);

export default router;


