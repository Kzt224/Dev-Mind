import express from "express";
import { loadConfig } from "../controller/config.controller.js";


const router = express.Router();

router.get("/config",loadConfig);

export default router;