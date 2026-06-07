import express from "express";
import { container } from "../container/index.js";
import { checkAuth } from "../middleware/auth.middleware.js";


const router = express.Router();
const taskController = container.get('taskController');
router.post("/task",checkAuth,taskController.createTask);
router.get("/task",checkAuth,taskController.getAllTask);
router.get("/task/:id",checkAuth,taskController.getTaskById);
router.patch("/task/:id",checkAuth,taskController.modifyTask);
router.delete("/task/:id",checkAuth,taskController.deleteTask);
export default router;