import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { checkInviteToken, createGroup, generateInviteLink, getAllGroup, getGroupDetail, sentMemberToFeedBack, userConnectWithInviteLink } from "../controller/team.Controller.js";

const router = express.Router();

router.post("/group",checkAuth,createGroup);
router.get("/group",checkAuth,getAllGroup);
router.get("/group/:id/member",checkAuth,getGroupDetail);
router.post("/group/generate",checkAuth,generateInviteLink);
router.post("/group/check",checkAuth,checkInviteToken);
router.post("/group/join",checkAuth,userConnectWithInviteLink);
router.post('/group/acceptOrReject',checkAuth,sentMemberToFeedBack);
export default router;