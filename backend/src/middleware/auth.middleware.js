import { decodeToken } from "../libs/jwt.js";


export const checkAuth = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({ message: "No token" });
        }

        const token = header.split(" ")[1];
        try {
            const decode = await decodeToken(token);
            if (!decode) {
                return res.status(401).json({ message: "Incorrect credential" });
            }
            req.user = decode;
            next();
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log("Error on checkAu function", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
