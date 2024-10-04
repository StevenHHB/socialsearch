-- AlterTable
ALTER TABLE "User" ADD COLUMN     "remaining_lead_finds" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "remaining_reply_generations" INTEGER NOT NULL DEFAULT 1;
