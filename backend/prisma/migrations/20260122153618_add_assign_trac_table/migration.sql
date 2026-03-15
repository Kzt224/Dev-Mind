-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "summary" TEXT,
    "startDate" DATETIME,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "endDate" DATETIME,
    "authorId" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "mode" TEXT NOT NULL DEFAULT 'SINGLE',
    "assignId" INTEGER,
    CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_assignId_fkey" FOREIGN KEY ("assignId") REFERENCES "AssignTrack" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("authorId", "createdAt", "duration", "endDate", "id", "mode", "name", "progress", "startDate", "summary", "updatedAt") SELECT "authorId", "createdAt", "duration", "endDate", "id", "mode", "name", "progress", "startDate", "summary", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_assignId_key" ON "Project"("assignId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
