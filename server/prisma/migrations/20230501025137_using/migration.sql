/*
  Warnings:

  - You are about to alter the column `resume` on the `jobapplication` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `jobapplication` MODIFY `resume` VARCHAR(191) NOT NULL;
