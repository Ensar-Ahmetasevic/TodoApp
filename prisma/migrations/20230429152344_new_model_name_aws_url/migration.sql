/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_todoId_fkey";

-- DropTable
DROP TABLE "File";

-- CreateTable
CREATE TABLE "AWS_URL" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "todoId" INTEGER NOT NULL,

    CONSTRAINT "AWS_URL_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AWS_URL" ADD CONSTRAINT "AWS_URL_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
