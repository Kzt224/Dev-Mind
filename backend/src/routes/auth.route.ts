import express from 'express';
import { container } from '../container/index.js';

const router = express.Router();
const authController = container.get('authController');
router.post("/signup",authController.signUp);
router.post("/login",authController.logIn);

export default router;
