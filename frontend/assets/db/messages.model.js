import { initDb } from "./db";

// Create messages table
export const createMessagesTable = async () => {
    try {
        const db = await initDb();
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS messages(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                chat_id INTEGER NOT NULL,
                sender_id TEXT NOT NULL,
                content TEXT NOT NULL,
                type TEXT NOT NULL,
                createdAt INTEGER DEFAULT (strftime('%s','now')),
                FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
            )
        `);
    } catch (error) {
        console.log("Error creating messages table:", error);
    }
};

// Create a new message
export const createMessage = async (data, senderId, type, chatId) => {
    try {
        const db = await initDb();

        if (!data || !chatId || !senderId || !type) {
            return { status: 400, message: "All data are required!" };
        }

        const content = data.text || data;
        const sender_id = senderId;

        await db.runAsync(
            `INSERT INTO messages(chat_id, sender_id, content, type) VALUES (?, ?, ?, ?)`,
            [chatId, sender_id, content, type]
        );

        await db.runAsync(
            `UPDATE chats SET lastUpdated = strftime('%s','now') WHERE id = ?`,
            [chatId]
        );

        return { status: 201, message: "Message created successfully!" };
    } catch (error) {
        console.log("Error in createMessage:", error);
        return { status: 500, message: "Failed to create message" };
    }
};

// Get all messages for a chat
export const getMessagesByChatsId = async (chatId) => {
    try {
        const db = await initDb();
        if (!chatId) {
            return { status: 400, message: "chat_id is required!" };
        }

        const result = await db.getAllAsync(
            `SELECT * FROM messages WHERE chat_id = ? ORDER BY createdAt DESC`,
            [chatId]
        );

        return result || [];
    } catch (error) {
        console.log("Error in getMessagesByChatsId:", error);
        return [];
    }
};

// Delete all messages for a chat
export const deleteMessagesById = async (chatId) => {
    try {
        const db = await initDb();
        if (!chatId) return { status: 400, message: "chat_id required!" };

        await db.runAsync(`DELETE FROM messages WHERE chat_id = ?`, [chatId]);

        return { status: 200, message: "Messages deleted successfully!" };
    } catch (error) {
        console.log("Error deleting messages:", error);
        return { status: 500, message: "Failed to delete messages" };
    }
};
