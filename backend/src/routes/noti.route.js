import express from "express";
import { addNotiEvidence, deleteNotification, getAllNoti, updateNotiById } from "../controller/noti.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/noti",checkAuth,getAllNoti);
router.patch("/noti/:id",checkAuth,updateNotiById);
router.post("/noti/evidence",checkAuth,addNotiEvidence);
router.post("/noti/delete",checkAuth,deleteNotification);
export default router;