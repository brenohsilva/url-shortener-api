/*
  Warnings:

  - You are about to drop the column `shortenerUrls_id` on the `tags` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `tags` DROP FOREIGN KEY `tags_shortenerUrls_id_fkey`;

-- DropIndex
DROP INDEX `tags_shortenerUrls_id_fkey` ON `tags`;

-- AlterTable
ALTER TABLE `tags` DROP COLUMN `shortenerUrls_id`;

-- CreateTable
CREATE TABLE `_ShortenerUrlsTags` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ShortenerUrlsTags_AB_unique`(`A`, `B`),
    INDEX `_ShortenerUrlsTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ShortenerUrlsTags` ADD CONSTRAINT `_ShortenerUrlsTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `ShortenerUrls`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ShortenerUrlsTags` ADD CONSTRAINT `_ShortenerUrlsTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
