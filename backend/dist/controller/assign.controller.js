import { logger } from "../libs/LogGenerator.js";
export class AssignController {
    AssignService;
    constructor(AssignService) {
        this.AssignService = AssignService;
    }
    ;
    assignTask = async (req, res) => {
        const userId = req?.user?.userId;
        try {
            const { projectId, taskId, assignUserId } = req.body;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const result = await this.AssignService.assignTask({ projectId, taskId, assignUserId, userId, io: req.app.get('io') });
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            logger.error("AssignController.asignTask failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error", error });
        }
    };
}
