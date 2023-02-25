-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "checkBox" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
