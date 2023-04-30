-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_todoId_fkey";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
