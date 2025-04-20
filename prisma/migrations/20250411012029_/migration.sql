/*
  Warnings:

  - The primary key for the `workspaces` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `shortenerurls` DROP FOREIGN KEY `ShortenerUrls_workspaceId_fkey`;

-- DropIndex
DROP INDEX `ShortenerUrls_workspaceId_fkey` ON `shortenerurls`;

-- AlterTable
ALTER TABLE `shortenerurls` MODIFY `workspaceId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `workspaces` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `ShortenerUrls` ADD CONSTRAINT `ShortenerUrls_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspaces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
