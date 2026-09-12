import { logger } from "../libs/LogGenerator.js";
export class NotificationController {
    NotiService;
    constructor(NotiService) {
        this.NotiService = NotiService;
    }
    getAllNoti = async (req, res) => {
        const userId = req?.user?.userId;
        try {
            const result = await this.NotiService.getAllNoti(userId);
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            logger.error("NotificationController.getAllNoti failed!", {
                userId: userId,
                error: error
            });
            return {
                status: 500,
                json: "Internal server error"
            };
        }
    };
    updateNotiById = async (req, res) => {
        const userId = req.user.userId;
        try {
            const { isRead } = req.body;
            const id = Number(req.params.id);
            const result = await this.NotiService.updateNotiById(userId, id, isRead);
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            logger.error("NotificationController.updateNotiById failed!", {
                userId: userId,
                error: error
            });
            return {
                status: 500,
                json: "Internal server error"
            };
        }
    };
    addNotiEvidence = async (req, res) => {
        const userId = req.user.userId;
        try {
            const { notiToken } = req.body;
            const result = await this.NotiService.addNotiEvidence(userId, notiToken);
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            logger.error("NotificationController.addNotiEvidence failed!", {
                userId: userId,
                error: error
            });
            return {
                status: 500,
                json: "Internal server error"
            };
        }
    };
    deleteNotification = async (req, res) => {
        try {
            const { id } = req.body;
            const result = await this.NotiService.deleteNotification(id);
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            return {
                status: 500,
                json: "Internal server error"
            };
        }
    };
}
