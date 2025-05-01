/*
  Warnings:

  - You are about to drop the `shortenerurlsontags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `shortenerurlsontags` DROP FOREIGN KEY `ShortenerUrlsOnTags_shortenerUrlId_fkey`;

-- DropForeignKey
ALTER TABLE `shortenerurlsontags` DROP FOREIGN KEY `ShortenerUrlsOnTags_tagId_fkey`;

-- DropTable
DROP TABLE `shortenerurlsontags`;

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
ALTER TABLE `_ShortenerUrlsTags` ADD CONSTRAINT `_ShortenerUrlsTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
