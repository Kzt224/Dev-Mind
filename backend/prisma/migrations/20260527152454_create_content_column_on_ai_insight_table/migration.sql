/*
  Warnings:

  - Added the required column `content` to the `AiInsight` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AiInsight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AiInsight" ("createdAt", "date", "id", "userId") SELECT "createdAt", "date", "id", "userId" FROM "AiInsight";
DROP TABLE "AiInsight";
ALTER TABLE "new_AiInsight" RENAME TO "AiInsight";
CREATE UNIQUE INDEX "AiInsight_userId_date_key" ON "AiInsight"("userId", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
