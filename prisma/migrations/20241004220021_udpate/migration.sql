/*
  Warnings:

  - You are about to drop the column `remaining_lead_finds` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `remaining_reply_generations` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscription" TEXT,
ALTER COLUMN "remaining_lead_finds" SET DEFAULT 0,
ALTER COLUMN "remaining_reply_generations" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "remaining_lead_finds",
DROP COLUMN "remaining_reply_generations";
