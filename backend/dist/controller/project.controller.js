import { logger } from "../libs/LogGenerator.js";
export class ProjectController {
    projectService;
    constructor(projectService) {
        this.projectService = projectService;
    }
    createProject = async (req, res) => {
        const userId = req.user?.userId;
        try {
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const data = req.body;
            const result = await this.projectService.create(data, userId);
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            logger.error("ProjectController.create failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    getProject = async (req, res) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const result = await this.projectService.getAllProject(userId);
            return res.status(result?.status).json({
                result: result.json
            });
        }
        catch (error) {
            console.log("Error on getProject function", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    getProjectById = async (req, res) => {
        const userId = req.user?.userId;
        try {
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const projectId = Number(req.params.id);
            if (isNaN(projectId)) {
                return res.status(400).json({ message: "Invalid project id" });
            }
            const result = await this.projectService.fetchProjectById(projectId, userId);
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            logger.error("ProjectController.getProjectById failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    editProject = async (req, res) => {
        const userId = req.user?.userId;
        try {
            const projectId = Number(req.params.id);
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (isNaN(projectId)) {
                return res.status(400).json({ message: "Invalid project id" });
            }
            const data = req.body;
            const result = await this.projectService.update(projectId, data, userId);
            return res
                .status(result.status)
                .json(result.json);
        }
        catch (error) {
            console.error("Error on project update function", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
}
