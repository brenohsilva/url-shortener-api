/*
  Warnings:

  - Added the required column `shorten_url` to the `Shortened_urls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shortened_urls` ADD COLUMN `shorten_url` VARCHAR(191) NOT NULL;
