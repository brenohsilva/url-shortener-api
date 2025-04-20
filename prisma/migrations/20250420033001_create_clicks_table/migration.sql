/*
  Warnings:

  - You are about to drop the column `clicks` on the `shortenerurls` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `tags` DROP FOREIGN KEY `tags_users_id_fkey`;

-- AlterTable
ALTER TABLE `shortenerurls` DROP COLUMN `clicks`;

-- CreateTable
CREATE TABLE `Clicks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shortenerUrls_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Clicks` ADD CONSTRAINT `Clicks_shortenerUrls_id_fkey` FOREIGN KEY (`shortenerUrls_id`) REFERENCES `ShortenerUrls`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tags` ADD CONSTRAINT `Tags_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `tags` RENAME INDEX `tags_name_key` TO `Tags_name_key`;
