import { Request, Response } from "express";
import { AuthServices } from "../services/authService.js";
import { AuthResultDto } from "../dto/authResult.dto.js";
import { CreateUserDto } from "../dto/create-user.dto.js";

export class AuthController {
    constructor(private authService: AuthServices) { }

    signUp = async (req: Request, res: Response): Promise<Response> => {
        const result: AuthResultDto = await this.authService.signUp(req.body as CreateUserDto);
        return res.status(result.status).json(result.json);
    }
    logIn = async (req: Request, res: Response): Promise<Response> => {
        const result: AuthResultDto = await this.authService.logIn(req.body as CreateUserDto);
        return res.status(result.status).json(result.json);
    }
}
