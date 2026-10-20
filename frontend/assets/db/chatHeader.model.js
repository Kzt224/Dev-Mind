import { initDb } from "./db";

// Create chats table
export const createChatsTable = async () => {
    try {
        const db = await initDb();
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS chats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER,
                title TEXT NOT NULL,
                user_id TEXT NOT NULL,
                lastUpdated TEXT DEFAULT (strftime('%s','now'))
            )
        `);
    } catch (error) {
        console.log("Error creating chats table:", error);
    }
};

// Create a new chat header
export const createChats = async (data) => {
    try {
        const db = await initDb();
        if (!data || !data.user_id) {
            return { status: 400, message: "User ID is required!" };
        }

        const title = data.title || "Chat " + new Date().toLocaleString();
        const project_id = data?.project_id;
        const user_id = data.user_id;

        const chHeader = await db.runAsync(
            `INSERT INTO chats (project_id, title, user_id) VALUES (?, ?, ?)`,
            [project_id, title, user_id]
        );

        return {
            status: 201,
            message: "Chat created successfully!",
            id: chHeader.lastInsertRowId,
        };
    } catch (error) {
        console.log("Error in createChats:", error);
        return { status: 500, message: "Failed to create chat" };
    }
};

// Get all chats for a user
export const getAllChats = async (user_id) => {
    try {
        const db = await initDb();
        if (!user_id) return [];

        const result = await db.getAllAsync(
            `SELECT * FROM chats WHERE user_id = ? ORDER BY lastUpdated DESC`,
            [user_id]
        );
        return result || [];
    } catch (error) {
        console.log("Error in getAllChats:", error);
        return [];
    }
};

// Delete a chat header by ID
export const deleteChatsById = async (id) => {
    try {
        const db = await initDb();
        await db.runAsync(`DELETE FROM chats WHERE id = ?`, [id]);
        return {
            status: 200,
            message: "Chat deleted successfully!",
        };
    } catch (error) {
        console.log("Error deleting chat by ID:", error);
        return { status: 500, message: "Failed to delete chat" };
    }
};
