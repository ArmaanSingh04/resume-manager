-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "type" "LinkType" NOT NULL,
    "fileId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_fileId_key" ON "Link"("fileId");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
