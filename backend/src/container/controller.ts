import { AssignController } from "../controller/assign.controller.js";
import { AuthController } from "../controller/auth.controller.js";
import { NotificationController } from "../controller/noti.controller.js";
import { ProjectController } from "../controller/project.controller.js";
import { TaskController } from "../controller/task.controller.js";
import { TeamController } from "../controller/team.controller.js";
import { UserController } from "../controller/user.controller.js";
import { Container } from "./container.js";

export function registerController(container: Container){
    // register new controller 
    container.register([
        {
            name: "authController",
            method: (c: any) =>{ return new AuthController(c.get('authService'))}
        },
        {
            name: "userController",
            method: (c: any) => {return new UserController(c.get('userService'))}
        },
        {
            name: "projectController",
            method: (c: any) => {return new ProjectController(c.get('projectService'))}
        },
        {
            name: "taskController",
            method: (c: any) => {return new TaskController(c.get('taskService'))}
        },
         {
            name: "teamController",
            method: (c: any) => {return new TeamController(c.get('teamService'))}
        },
        {
            name: "assignController",
            method: (c: any) => {return new AssignController(c.get('assignService'))}
        },
         {
            name: "notiController",
            method: (c: any) => {return new NotificationController(c.get('notiService'))}
        },
    ]);
}


