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
    "category" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'SINGLE',
    "assignId" INTEGER,
    "modifyProjectId" INTEGER,
    CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_assignId_fkey" FOREIGN KEY ("assignId") REFERENCES "AssignTrack" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_modifyProjectId_fkey" FOREIGN KEY ("modifyProjectId") REFERENCES "ModTracker" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("assignId", "authorId", "createdAt", "duration", "endDate", "id", "mode", "modifyProjectId", "name", "progress", "startDate", "summary", "updatedAt") SELECT "assignId", "authorId", "createdAt", "duration", "endDate", "id", "mode", "modifyProjectId", "name", "progress", "startDate", "summary", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_assignId_key" ON "Project"("assignId");
CREATE UNIQUE INDEX "Project_modifyProjectId_key" ON "Project"("modifyProjectId");
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "duration" INTEGER,
    "delay" INTEGER,
    "reason" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "note" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "authorId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "notifiable" BOOLEAN NOT NULL DEFAULT false,
    "assignId" INTEGER,
    "modifyTestId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Task_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_assignId_fkey" FOREIGN KEY ("assignId") REFERENCES "AssignTrack" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_modifyTestId_fkey" FOREIGN KEY ("modifyTestId") REFERENCES "ModTracker" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("assignId", "authorId", "createdAt", "delay", "duration", "endDate", "id", "modifyTestId", "name", "note", "notifiable", "progress", "projectId", "reason", "startDate", "status", "updatedAt") SELECT "assignId", "authorId", "createdAt", "delay", "duration", "endDate", "id", "modifyTestId", "name", "note", "notifiable", "progress", "projectId", "reason", "startDate", "status", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_assignId_key" ON "Task"("assignId");
CREATE UNIQUE INDEX "Task_modifyTestId_key" ON "Task"("modifyTestId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
