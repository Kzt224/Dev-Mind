/*
  Warnings:

  - A unique constraint covering the columns `[updateUserId,taskId]` on the table `ModTracker` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ModTracker_updateUserId_taskId_key" ON "ModTracker"("updateUserId", "taskId");
