import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../libs/jwt.js";

export const checkAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            res.status(401).json({ message: "No token" });
            return;
        }

        const token = header.split(" ")[1];
        const decode = await decodeToken(token);

        if (!decode) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        req.user = decode as { userId: number };
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};