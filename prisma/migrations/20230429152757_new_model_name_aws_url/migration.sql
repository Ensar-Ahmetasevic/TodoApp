/*
  Warnings:

  - You are about to drop the `AWS_URL` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AWS_URL" DROP CONSTRAINT "AWS_URL_todoId_fkey";

-- DropTable
DROP TABLE "AWS_URL";

-- CreateTable
CREATE TABLE "AwsUrl" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "todoId" INTEGER NOT NULL,

    CONSTRAINT "AwsUrl_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AwsUrl" ADD CONSTRAINT "AwsUrl_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
