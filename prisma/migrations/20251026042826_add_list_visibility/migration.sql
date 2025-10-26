/*
  Warnings:

  - Made the column `description` on table `project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `liveLink` on table `project` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ListVisibility" AS ENUM ('PUBLIC', 'UNLISTED');

-- AlterTable
ALTER TABLE "list" ADD COLUMN     "visibility" "ListVisibility" NOT NULL DEFAULT 'UNLISTED';

-- AlterTable
ALTER TABLE "project" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "liveLink" SET NOT NULL;
