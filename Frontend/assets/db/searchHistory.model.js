import { initDb } from "./db"


export const createSearchHistoryTable = async () => {
    try {
        const db = await initDb();
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS searchhistory(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              content TEXT NOT NULL,
              userId INTEGER NOT NULL,
              createdAt INTEGER DEFAULT (strftime('%s','now')),
            )`
        );
    } catch (error) {
        console.log("Error creating searchHistory table:", error);
    }
}

export const getSearchHistory = async (userId) => {
    try {
        const userId = Number(userId);
        const db = await initDb();
        if (!userId) return [];

        const result = await db.getAllAsync(
            `SELECT * FROM chathistory WHERE userId = ? ORDER BY createdAt DESC`,
            [userId]
        );
        return result || [];
    } catch (error) {
        console.log("Error get searchHistory ", error);
    }
}

export const deleteSearchHistory = async (id) => {
    try {
        const searchId = Number(id);
        const db = await initDb();
        if (!searchId) return [];

        await db.runAsync(`DELETE FROM searchhistory WHERE id = ?`, [searchId]);
        return {
            status: 200,
            message: "Searchhistory deleted successfully!",
        };
    } catch (error) {
        console.log("Delete search history", error);
    }
}