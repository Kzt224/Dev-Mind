import express from "express";
import { getUserById, updatePassword, updateUserInfo } from "../controller/user.controller.js";
import { checkAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/user/:id",checkAuth,getUserById);
router.patch("/user/updateinfo",checkAuth,updateUserInfo);
router.patch("/user/updatepassword",checkAuth,updatePassword);
export default router;
