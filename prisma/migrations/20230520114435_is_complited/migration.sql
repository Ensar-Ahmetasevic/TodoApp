/*
  Warnings:

  - You are about to drop the column `checkBox` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `checkBox` on the `TodoList` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `TodoList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "checkBox",
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TodoList" DROP COLUMN "checkBox",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
