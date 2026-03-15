-- CreateTable
CREATE TABLE "AssignTrack" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assignedUserId" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AssignTrack_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "notifiable" BOOLEAN NOT NULL DEFAULT false,
    "assignId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Task_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_assignId_fkey" FOREIGN KEY ("assignId") REFERENCES "AssignTrack" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("authorId", "createdAt", "delay", "duration", "endDate", "id", "name", "note", "notifiable", "progress", "projectId", "reason", "startDate", "status") SELECT "authorId", "createdAt", "delay", "duration", "endDate", "id", "name", "note", "notifiable", "progress", "projectId", "reason", "startDate", "status" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_assignId_key" ON "Task"("assignId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
