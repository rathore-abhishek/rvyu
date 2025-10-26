/*
  Warnings:

  - You are about to drop the `vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."vote" DROP CONSTRAINT "vote_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."vote" DROP CONSTRAINT "vote_userId_fkey";

-- DropTable
DROP TABLE "public"."vote";

-- CreateTable
CREATE TABLE "list_project_vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listProjectId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "list_project_vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "list_project_vote_userId_listProjectId_key" ON "list_project_vote"("userId", "listProjectId");

-- AddForeignKey
ALTER TABLE "list_project_vote" ADD CONSTRAINT "list_project_vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_project_vote" ADD CONSTRAINT "list_project_vote_listProjectId_fkey" FOREIGN KEY ("listProjectId") REFERENCES "list_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
