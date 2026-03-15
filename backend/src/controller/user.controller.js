import { PrismaClient } from "../../generated/prisma/index.js";
import { encryptPassword } from "../libs/hashpassword.js";
import UserNoti from "./userNoti/updateUserInfoNoti.js";


const prisma = new PrismaClient();
export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!result) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({
            user: {
                name: result.name,
                email: result.email,
                phone: result.phone,
                userName: result.userName
            }
        });
    } catch (error) {
        console.log("error on getUserBy id", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const updateUserInfo = async (req, res) => {
  try {
    const userId = Number(req.user.userId);
    const { email, phone, userName, name } = req.body;

    if (!email && !phone && !userName && !name) {
      return res.status(400).json({
        message: "Require email, phone, username, or name to update"
      });
    }

    // 1. Check if email already exists
    if (email) {
      const existing = await prisma.user.findUnique({
        where: { email }
      });

      if (existing && existing.id !== userId) {
        return res.status(400).json({
          message: "Email already in use by another account"
        });
      }
    }

    // 2. Update user info
    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        phone,
        userName,
        name
      }
    });

    // 3. Notify
    const noti = new UserNoti({
      date: result.updatedAt,
      userId,
      socketIo: req.app.get("io")
    });
    await noti.updateInfoNoti();

    return res.status(200).json({
      message: "User info updated successfully",
      data: result
    });

  } catch (error) {
    console.log("error on updateUserInfo", error);

    // Prisma unique constraint error
    if (error.code === "P2002") {
      return res.status(400).json({
        message: `Duplicate field: ${error.meta.target}`
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePassword = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = Number(req.user.userId);
        if (!password) {
            return res.status(400).json({ message: "Password required" });
        }
        if (password && password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        const hasedPassword = await encryptPassword(password);
        if (!hasedPassword) return res.status(500).json({ message: "Internal server error" });
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hasedPassword
            }
        });
        const noti = new UserNoti({
            date: new Date().toISOString(),
            userId: userId,
            socketIo: req.app.get("io")
        });
        await noti.updatePasswordNoti();
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.log("Error on update password", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}