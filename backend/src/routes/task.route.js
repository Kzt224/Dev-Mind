import express from "express";
import { createTask, deleteTask, getAllTask, getTaskById, modifyTask } from "../controller/task.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/task",checkAuth,createTask);
router.get("/task",checkAuth,getAllTask);
router.get("/task/:id",checkAuth,getTaskById);
router.patch("/task/:id",checkAuth,modifyTask);
router.delete("/task/:id",checkAuth,deleteTask);
export default router;