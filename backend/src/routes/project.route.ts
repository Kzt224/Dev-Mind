import express from "express";
import { container } from "../container/index.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

const projectController = container.get("projectController");

router.get("/project", checkAuth, projectController.getProject);
router.post("/project", checkAuth, projectController.createProject);
router.get("/project/:id", checkAuth, projectController.getProjectById);
router.patch("/project/:id", checkAuth, projectController.editProject);

export default router;