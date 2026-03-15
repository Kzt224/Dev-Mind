/*
  Warnings:

  - You are about to drop the column `retryAt` on the `Invitation` table. All the data in the column will be lost.
  - Added the required column `retryAt` to the `JoinRequest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invitation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "leaderId" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "groupId" INTEGER NOT NULL,
    CONSTRAINT "Invitation_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invitation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invitation" ("createdAt", "expiresAt", "groupId", "id", "leaderId", "maxUses", "token", "usedCount") SELECT "createdAt", "expiresAt", "groupId", "id", "leaderId", "maxUses", "token", "usedCount" FROM "Invitation";
DROP TABLE "Invitation";
ALTER TABLE "new_Invitation" RENAME TO "Invitation";
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");
CREATE TABLE "new_JoinRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "retryAt" DATETIME NOT NULL
);
INSERT INTO "new_JoinRequest" ("createdAt", "groupId", "id", "joinStatus", "updatedAt", "userId") SELECT "createdAt", "groupId", "id", "joinStatus", "updatedAt", "userId" FROM "JoinRequest";
DROP TABLE "JoinRequest";
ALTER TABLE "new_JoinRequest" RENAME TO "JoinRequest";
CREATE UNIQUE INDEX "JoinRequest_groupId_userId_key" ON "JoinRequest"("groupId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
