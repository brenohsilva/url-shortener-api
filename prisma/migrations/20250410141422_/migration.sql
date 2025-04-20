/*
  Warnings:

  - You are about to drop the `shortenedurls` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `shortenedurls` DROP FOREIGN KEY `ShortenedUrls_userId_fkey`;

-- DropForeignKey
ALTER TABLE `shortenedurls` DROP FOREIGN KEY `ShortenedUrls_workspaceId_fkey`;

-- DropTable
DROP TABLE `shortenedurls`;

-- CreateTable
CREATE TABLE `ShortenerUrls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `workspaceId` INTEGER NULL,
    `shortCode` VARCHAR(191) NOT NULL,
    `originUrl` VARCHAR(191) NOT NULL,
    `shortenUrl` VARCHAR(191) NOT NULL,
    `clicks` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,
    `expires_at` DATETIME(3) NULL,

    UNIQUE INDEX `ShortenerUrls_shortCode_key`(`shortCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ShortenerUrls` ADD CONSTRAINT `ShortenerUrls_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShortenerUrls` ADD CONSTRAINT `ShortenerUrls_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspaces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
