import { AssignService } from "../services/assignService.js"
import { AuthServices } from "../services/authService.js"
import { NotificationService } from "../services/notificationService.js"
import { ProjectService } from "../services/projectService.js"
import { TaskService } from "../services/taskServies.js"
import { TeamService } from "../services/teamService.js"
import { UserService } from "../services/userService.js"
import { Container } from "./container.js"


export function registerServices(container: Container) {
    container.register([
        { name: "authService",    method: () => { return new AuthServices() } },
        { name: "userService",    method: () => { return new UserService() } },
        { name: "projectService", method: () => { return new ProjectService() } },
        { name: 'taskService',    method: () => { return new TaskService() } },
        { name: 'teamService',    method: () => { return new TeamService() } },
        { name: 'assignService',  method: () => { return new AssignService() } },
        { name: "notiService",    method: () => { return new NotificationService } }
    ])
}