import express from "express";
import { createProject, editProject, getProject, getProjectById } from "../controller/project.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/project",checkAuth,getProject);
router.post("/project",checkAuth,createProject);
router.get("/project/:id",checkAuth,getProjectById);
router.patch("/project/:id",checkAuth,editProject);

export default router;