/*
  Warnings:

  - Made the column `updatedAt` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ModTracker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "updateUserId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ModTracker_updateUserId_fkey" FOREIGN KEY ("updateUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "progress" INTEGER NOT NULL DEFAULT 0,
    "mode" TEXT NOT NULL DEFAULT 'SINGLE',
    "authorId" INTEGER NOT NULL,
    "assignId" INTEGER,
    "modifyProjectId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_assignId_fkey" FOREIGN KEY ("assignId") REFERENCES "AssignTrack" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_modifyProjectId_fkey" FOREIGN KEY ("modifyProjectId") REFERENCES "ModTracker" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("assignId", "authorId", "createdAt", "duration", "endDate", "id", "mode", "name", "progress", "startDate", "summary", "updatedAt") SELECT "assignId", "authorId", "createdAt", "duration", "endDate", "id", "mode", "name", "progress", "startDate", "summary", "updatedAt" FROM "Project";
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
    "status" TEXT NOT NULL DEFAULT 'WAITING',
    "note" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "notifiable" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "assignId" INTEGER,
    "modifyTestId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_assignId_fkey" FOREIGN KEY ("assignId") REFERENCES "AssignTrack" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_modifyTestId_fkey" FOREIGN KEY ("modifyTestId") REFERENCES "ModTracker" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("assignId", "authorId", "createdAt", "delay", "duration", "endDate", "id", "name", "note", "notifiable", "progress", "projectId", "reason", "startDate", "status") SELECT "assignId", "authorId", "createdAt", "delay", "duration", "endDate", "id", "name", "note", "notifiable", "progress", "projectId", "reason", "startDate", "status" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_assignId_key" ON "Task"("assignId");
CREATE UNIQUE INDEX "Task_modifyTestId_key" ON "Task"("modifyTestId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
