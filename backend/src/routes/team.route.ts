import express from "express";
import { container } from "../container/index.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
const teamController = container.get("teamController");
router.post("/group", checkAuth, teamController.createGroup);
router.get("/group", checkAuth, teamController.getAllGroup);
router.get("/group/:id/member", checkAuth, teamController.getGroupDetail);
router.post("/group/generate", checkAuth, teamController.generateInviteLink);
router.post("/group/check", checkAuth, teamController.checkInviteToken);
router.post("/group/join", checkAuth, teamController.userConnectWithInviteLink);
router.post('/group/acceptOrReject', checkAuth, teamController.sentMemberToFeedBack);
router.post("/group/leftgroup", checkAuth, teamController.leftFromGroup);
export default router;