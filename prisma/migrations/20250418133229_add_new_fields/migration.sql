/*
  Warnings:

  - You are about to drop the column `originUrl` on the `shortenerurls` table. All the data in the column will be lost.
  - You are about to drop the column `shortCode` on the `shortenerurls` table. All the data in the column will be lost.
  - You are about to drop the column `shortenUrl` on the `shortenerurls` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `shortenerurls` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `shortenerurls` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `workspaces` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[short_code]` on the table `ShortenerUrls` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Workspaces` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `origin_url` to the `ShortenerUrls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `short_code` to the `ShortenerUrls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shorten_url` to the `ShortenerUrls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `Workspaces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `shortenerurls` DROP FOREIGN KEY `ShortenerUrls_userId_fkey`;

-- DropForeignKey
ALTER TABLE `shortenerurls` DROP FOREIGN KEY `ShortenerUrls_workspaceId_fkey`;

-- DropForeignKey
ALTER TABLE `workspaces` DROP FOREIGN KEY `Workspaces_ownerId_fkey`;

-- DropIndex
DROP INDEX `ShortenerUrls_shortCode_key` ON `shortenerurls`;

-- DropIndex
DROP INDEX `ShortenerUrls_userId_fkey` ON `shortenerurls`;

-- DropIndex
DROP INDEX `ShortenerUrls_workspaceId_fkey` ON `shortenerurls`;

-- DropIndex
DROP INDEX `Workspaces_ownerId_fkey` ON `workspaces`;

-- AlterTable
ALTER TABLE `shortenerurls` DROP COLUMN `originUrl`,
    DROP COLUMN `shortCode`,
    DROP COLUMN `shortenUrl`,
    DROP COLUMN `userId`,
    DROP COLUMN `workspaceId`,
    ADD COLUMN `comments` VARCHAR(191) NULL,
    ADD COLUMN `origin_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `short_code` VARCHAR(191) NOT NULL,
    ADD COLUMN `shorten_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `users_id` INTEGER NULL,
    ADD COLUMN `workspaces_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `workspaces` DROP COLUMN `ownerId`,
    ADD COLUMN `owner_id` INTEGER NOT NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `users_id` INTEGER NOT NULL,
    `shortenerUrls_id` INTEGER NULL,

    UNIQUE INDEX `tags_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ShortenerUrls_short_code_key` ON `ShortenerUrls`(`short_code`);

-- CreateIndex
CREATE UNIQUE INDEX `Workspaces_slug_key` ON `Workspaces`(`slug`);

-- AddForeignKey
ALTER TABLE `Workspaces` ADD CONSTRAINT `Workspaces_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShortenerUrls` ADD CONSTRAINT `ShortenerUrls_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShortenerUrls` ADD CONSTRAINT `ShortenerUrls_workspaces_id_fkey` FOREIGN KEY (`workspaces_id`) REFERENCES `Workspaces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tags` ADD CONSTRAINT `tags_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tags` ADD CONSTRAINT `tags_shortenerUrls_id_fkey` FOREIGN KEY (`shortenerUrls_id`) REFERENCES `ShortenerUrls`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
