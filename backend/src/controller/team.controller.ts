import { JoinStatus } from "../../generated/prisma/index.js";
import { logger } from "../libs/LogGenerator.js";
import { TeamService } from "../services/teamService.js";
import { Request, Response } from "express";

interface RequestwithUser extends Request {
    user: { userId: number }
}

interface RequestData {
    requestId: number;
    info: string;
    status: JoinStatus
}
interface TeamProp {
    group: { groupId: number }
}
export class TeamController {
    constructor(private TeamServices: TeamService) { }

    createGroup = async (req: RequestwithUser, res: Response): Promise<Response> => {
        const userId = req.user?.userId;
        try {
            const { name } = req?.body;
            const result = await this.TeamServices.createGroup(userId, name);
            return res.status(result.status).json(result.json);
        } catch (error) {
            logger.error("TeamController.create failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    getAllGroup = async (req: RequestwithUser, res: Response): Promise<Response> => {
        const userId = req.user?.userId;
        try {
            const result = await this.TeamServices.getAllGroup(userId);
            return res.status(result.status).json(result.json);
        } catch (error) {
            logger.error("TeamController.getAllGroup failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    getGroupDetail = async (req: RequestwithUser, res: Response): Promise<Response> => {
        const userId = req.user?.userId;
        try {
            const groupId = Number(req?.params?.id || 0);
            const result = await this.TeamServices.getGroupDetail(groupId, userId);
            return res.status(result.status).json(result.json);
        } catch (error) {
            logger.error("TeamController.getGroupDetail failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    generateInviteLink = async (req: RequestwithUser, res: Response): Promise<Response> => {
        const userId = req.user?.userId;
        try {
            const { groupId } = req?.body?.groupId;
            const test = Number(groupId);
            const result = await this.TeamServices.generateInviteLink(test, userId);
            return res.status(result.status).json(result.json);
        } catch (error) {
            logger.error("TeamController.generateInviteLink failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    checkInviteToken = async (req: RequestwithUser, res: Response): Promise<Response> => {
        const userId = req.user?.userId;
        try {
            const inviteToken: string = req?.body?.inviteToken;
            const result = await this.TeamServices.checkInviteToken(inviteToken, userId);
            return res.status(result.status).json(result.json);
        } catch (error) {
            logger.error("TeamController.generateInviteLink failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    userConnectWithInviteLink = async (req: RequestwithUser, res: Response): Promise<Response> => {
        const userId = req.user?.userId;
        try {
            const result = await this.TeamServices.userConnectWithInviteLink(userId, req.body.data, req.app.get("io"));
            return res.status(result.status).json(result.json);
        } catch (error) {
            logger.error("TeamController.userConnectWithInviteLink failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    leftFromGroup = async (req: RequestwithUser, res: Response): Promise<Response> => {
        const userId = req?.user?.userId;
        try {
            const data = req.body;
            const result = await this.TeamServices.GroupLeftRequest(data, userId, req.app.get("io"));
            return res.status(result.status).json(result.json);
        } catch (error) {
            logger.error("TeamController.leftFromGroup failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    sentMemberToFeedBack = async (req: RequestwithUser, res: Response): Promise<Response> => {
        const userId = req.user?.userId;
        try {
            const { requestId, status, info }: RequestData = req.body;
            const result = await this.TeamServices.sentMemberToFeedBack(userId, requestId, status, info, req.app.get("io"));
            return res.status(result.status).json(result.json);
        } catch (error) {
            logger.error("TeamController.userConnectWithInviteLink failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
