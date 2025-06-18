/*
  Warnings:

  - You are about to drop the column `status` on the `Project` table. All the data in the column will be lost.
  - Added the required column `access_token` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank_code` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_kana` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `access_token` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Project` DROP COLUMN `status`,
    ADD COLUMN `access_token` VARCHAR(191) NOT NULL,
    ADD COLUMN `bank_code` INTEGER NOT NULL,
    ADD COLUMN `name_kana` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `access_token` VARCHAR(191) NOT NULL;
