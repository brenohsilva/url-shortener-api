/*
  Warnings:

  - You are about to drop the column `origin_url` on the `shortened_urls` table. All the data in the column will be lost.
  - Added the required column `original_url` to the `Shortened_urls` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `shortened_urls` DROP FOREIGN KEY `Shortened_urls_users_id_fkey`;

-- DropIndex
DROP INDEX `Shortened_urls_users_id_fkey` ON `shortened_urls`;

-- AlterTable
ALTER TABLE `shortened_urls` DROP COLUMN `origin_url`,
    ADD COLUMN `original_url` VARCHAR(191) NOT NULL,
    MODIFY `users_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Shortened_urls` ADD CONSTRAINT `Shortened_urls_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
