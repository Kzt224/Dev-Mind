import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { assignTask } from "../controller/assign.controller.js";


const router = express.Router();

router.post("/task/:id/assign",checkAuth,assignTask);




export default router;