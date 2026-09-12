import { logger } from "../libs/LogGenerator.js";
export class TaskController {
    TaskService;
    constructor(TaskService) {
        this.TaskService = TaskService;
    }
    ;
    //2026.04.21 create task 
    createTask = async (req, res) => {
        const userId = req.user?.userId;
        try {
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const data = req.body;
            const result = await this.TaskService.createTask(data, userId);
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            logger.error("TaskController.create failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    //2026.04.21 modify task 
    modifyTask = async (req, res) => {
        const userId = req.user?.userId;
        try {
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const taskId = Number(req.params.id);
            if (isNaN(taskId)) {
                return res.status(400).json({ message: "Invalid task id" });
            }
            const data = req.body;
            const result = await this.TaskService.modifyTask(taskId, data, userId, req.app?.get("io"));
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            logger.error("TaskController.modifyTask failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    //2026.04.21 get all  task 
    getAllTask = async (req, res) => {
        const userId = Number(req.user?.userId);
        try {
            const result = await this.TaskService.getAllTask(userId);
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            logger.error("TaskController.getAllTask failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    //2026.04.21 get task by id
    getTaskById = async (req, res) => {
        const userId = req.user?.userId;
        try {
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const taskId = Number(req.params.id);
            if (isNaN(taskId)) {
                return res.status(400).json({ message: "Invalid task id" });
            }
            const result = await this.TaskService.getTaskById(taskId, userId);
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            logger.error("TaskController.getTaskById failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    //2026.04.21 delete task  id
    deleteTask = async (req, res) => {
        const userId = req.user?.userId;
        try {
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const taskId = Number(req.params.id);
            if (isNaN(taskId)) {
                return res.status(400).json({ message: "Invalid task id" });
            }
            const result = await this.TaskService.deleteTask(taskId, userId);
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            logger.error("TaskController.deleteTask failed!", {
                userId,
                error
            });
            return res.status(500).json({ message: "Internal server error" });
        }
    };
}
