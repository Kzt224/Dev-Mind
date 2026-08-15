import { logger } from "../libs/LogGenerator.js";
import { AssignService } from "../services/assignService.js";
import { Request, Response } from "express";
interface RequestwithUser extends Request {
    user?: { userId: number }
}
export class AssignController {
    constructor(private AssignService: AssignService) { };
    assignTask = async (req: RequestwithUser, res: Response) => {
        const userId = req?.user?.userId;
        try {
            const { projectId, taskId, assignUserId } = req.body;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const result = await this.AssignService.assignTask({ projectId, taskId, assignUserId, userId, io: req.app.get('io') });
            return res.status(result.status).json(result.json);
        } catch (error) {
            logger.error("AssignController.asignTask failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error", error });
        }
    }
}

