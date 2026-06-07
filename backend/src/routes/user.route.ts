import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { UserService } from "../services/userService.js";
import { UserController } from "../controller/user.controller.js";
import { container } from "../container/index.js";

const router = express.Router();
const userController = container.get("userController");
router.get("/user/:id", checkAuth, userController.getUserById);
router.patch("/user/updateinfo", checkAuth, userController.updateUserInfo);
router.patch("/user/updatepassword", checkAuth, userController.updatePassword);
export default router;
