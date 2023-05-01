/*
  Warnings:

  - Made the column `status` on table `jobapplication` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `jobapplication` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';
