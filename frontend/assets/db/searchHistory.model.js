import { initDb } from "./db"


export const createSearchHistoryTable = async () => {
    try {
        const db = await initDb();

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS searchhistory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                userId INTEGER NOT NULL,
                createdAt INTEGER DEFAULT (strftime('%s','now'))
            )
        `);

    } catch (error) {
        console.log("Error creating searchHistory table:", error);
    }
};
export const createHistory = async (data) => {
    try {
        const { userId, content } = data;
        const db = await initDb();
        if (!userId || !content) {
            return '';
        }
        await db.runAsync(
            `INSERT INTO searchhistory(content, userId) VALUES (?, ?)`,
            [content, userId]
        );
        return { status: 201, message: "SearchHistory created successfully!" };

    } catch (error) {
        console.log("Error in createMessage:", error);
        return { status: 500, message: "Failed to create searchHistory" };
    }
}
export const getSearchHistory = async (uId) => {
    try {
        const userId = Number(uId);
        const db = await initDb();
        if (!userId) return [];

        const result = await db.getAllAsync(
            `SELECT * FROM searchhistory WHERE userId = ? ORDER BY createdAt DESC`,
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