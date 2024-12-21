/*
  Warnings:

  - Added the required column `isUpvote` to the `Upvote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Upvote" ADD COLUMN     "isUpvote" BOOLEAN NOT NULL;
