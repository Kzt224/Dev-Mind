import express from 'express';

const router = express.Router();
router.get("/helthcheck", (req, res) => {
    res.status(200).json({ "message": "Application was loaded successfully" });
});
export default router;

