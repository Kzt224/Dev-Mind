export class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    getUserById = async (req, res) => {
        try {
            const userId = req.user?.userId;
            const result = await this.userService.findUser(userId || 0);
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            console.log("error on getUserBy id", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    updateUserInfo = async (req, res) => {
        try {
            const userId = req.user?.userId || 0;
            const result = await this.userService.updateUser(userId, req.body, req.app.get("io"));
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            console.log("error on updateUserInfo", error);
            if (error.code === "P2002") {
                return res.status(400).json({ message: `Duplicate field: ${error.meta.target}` });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    updatePassword = async (req, res) => {
        try {
            const userId = req.user?.userId || 0;
            const result = await this.userService.updatePassword(userId, req.body.password, req.app.get("io"));
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            console.log("Error on update password", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    getUploadSignature = async (req, res) => {
        try {
            const userId = req?.user?.userId;
            if (!userId)
                return res.status(403).json({ message: "Forbridden" });
            const result = await this.userService.getSignature(userId);
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            console.log("Error on getUploadSignature password", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    uploadProfilePicture = async (req, res) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(402).json("Unauthorize");
            }
            const { imageName, imageUrl } = req.body;
            const result = await this.userService.uploadProfile(imageUrl, userId);
            return res.status(result.status).json(result.json);
        }
        catch (error) {
            console.log("Error on update password", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
}
