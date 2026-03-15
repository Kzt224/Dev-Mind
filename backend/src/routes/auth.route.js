import express from 'express';
import { logIn, signUp } from '../controller/auth.controller.js';


const router = express.Router();

router.post("/signup",signUp);
router.post("/login",logIn);
export default router;
