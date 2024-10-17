/*
  Warnings:

  - You are about to drop the column `authProvider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_providerId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "authProvider",
DROP COLUMN "lastLogin",
DROP COLUMN "providerId";

-- CreateTable
CREATE TABLE "UserProvider" (
    "id" SERIAL NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProvider_providerId_key" ON "UserProvider"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "provider_unique_constraint" ON "UserProvider"("providerId");

-- AddForeignKey
ALTER TABLE "UserProvider" ADD CONSTRAINT "UserProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
