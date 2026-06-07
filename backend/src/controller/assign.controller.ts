import { AssignService } from "../services/assignService.js";
import { Request, Response } from "express";

export class AssignController {
    constructor(private AssignService: AssignService) { };
    assignTask = async (req: Request, res: Response) => {
        try {
            const { projectId, taskId, assignUserId, userId } = req.body;
            const result = await this.AssignService.assignTask({ projectId, taskId, assignUserId, userId, io: req.app.get('io') });
            return res.status(result.status).json(result.json);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error", error });
        }
    }
}

