/*
  Warnings:

  - The `end_date` column on the `subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `plan_interval` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan_name` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remaining_lead_finds` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remaining_reply_generations` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `start_date` on the `subscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "plan_interval" TEXT NOT NULL,
ADD COLUMN     "plan_name" TEXT NOT NULL,
ADD COLUMN     "remaining_lead_finds" INTEGER NOT NULL,
ADD COLUMN     "remaining_reply_generations" INTEGER NOT NULL,
DROP COLUMN "start_date",
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "end_date",
ADD COLUMN     "end_date" TIMESTAMP(3);
