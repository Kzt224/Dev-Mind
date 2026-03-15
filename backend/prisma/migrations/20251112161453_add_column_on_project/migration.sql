-- AlterTable
ALTER TABLE "Project" ADD COLUMN "endDate" DATETIME;
ALTER TABLE "Project" ADD COLUMN "startDate" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "duration" INTEGER,
    "delay" INTEGER,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "note" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "authorId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Task_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("authorId", "delay", "duration", "endDate", "id", "name", "note", "projectId", "reason", "startDate", "status") SELECT "authorId", "delay", "duration", "endDate", "id", "name", "note", "projectId", "reason", "startDate", "status" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
