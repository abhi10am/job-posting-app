-- AlterTable
ALTER TABLE `jobapplication` MODIFY `status` ENUM('APPROVED', 'REJECTED') NULL,
    MODIFY `rejectReason` VARCHAR(191) NULL,
    MODIFY `relevancyScore` INTEGER NULL;
