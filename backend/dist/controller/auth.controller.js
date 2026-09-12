export class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    signUp = async (req, res) => {
        const result = await this.authService.signUp(req.body);
        return res.status(result.status).json(result.json);
    };
    logIn = async (req, res) => {
        const result = await this.authService.logIn(req.body);
        return res.status(result.status).json(result.json);
    };
}
