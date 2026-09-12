/*
  Warnings:

  - A unique constraint covering the columns `[groupId,userId,info]` on the table `JoinRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "JoinRequest_groupId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "JoinRequest_groupId_userId_info_key" ON "JoinRequest"("groupId", "userId", "info");
