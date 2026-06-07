import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { container } from "../container/index.js";

const router = express.Router();

const notiController = container.get('notiController');
router.get("/noti",checkAuth,notiController.getAllNoti);
router.patch("/noti/:id",checkAuth,notiController.updateNotiById);
router.post("/noti/evidence",checkAuth,notiController.addNotiEvidence);
router.post("/noti/delete",checkAuth,notiController.deleteNotification);
export default router;