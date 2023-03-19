-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "checkBox" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "pasword" TEXT NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
