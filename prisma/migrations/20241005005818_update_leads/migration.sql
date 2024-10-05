/*
  Warnings:

  - The primary key for the `Lead` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reply` on the `Lead` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_pkey",
DROP COLUMN "reply",
ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "authorName" TEXT,
ADD COLUMN     "authorUrl" TEXT,
ADD COLUMN     "contentLanguage" TEXT,
ADD COLUMN     "contentType" TEXT,
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nsfw" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "numComments" INTEGER,
ADD COLUMN     "postTitle" TEXT,
ADD COLUMN     "postUrl" TEXT,
ADD COLUMN     "score" INTEGER,
ADD COLUMN     "subredditName" TEXT,
ADD COLUMN     "subredditTitle" TEXT,
ADD COLUMN     "subredditUrl" TEXT,
ADD COLUMN     "upvoteRatio" DOUBLE PRECISION,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Lead_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Lead_id_seq";
