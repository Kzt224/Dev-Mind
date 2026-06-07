import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { container } from "../container/index.js";


const router = express.Router();
const assignController = container.get("assignController");
router.post("/task/:id/assign",checkAuth,assignController.assignTask);

export default router;