-- ═══════════════════════════════════════════════════════
-- جدول الطلبات — شغّله في phpMyAdmin مرة واحدة
-- ═══════════════════════════════════════════════════════

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `bookings` (
  `id`               VARCHAR(20) PRIMARY KEY,
  `name`             VARCHAR(255) NOT NULL,
  `phone`            VARCHAR(50) NOT NULL,
  `idNumber`         VARCHAR(100) NOT NULL,
  `email`            VARCHAR(255) DEFAULT '',
  `notes`            TEXT DEFAULT '',
  `pickupLocation`   VARCHAR(255) NOT NULL,
  `dropoffLocation`  VARCHAR(255) NOT NULL,
  `pickupDate`       DATE NOT NULL,
  `pickupTime`       VARCHAR(10) NOT NULL DEFAULT '09:00',
  `dropoffDate`      DATE NOT NULL,
  `dropoffTime`      VARCHAR(10) NOT NULL DEFAULT '09:00',
  `days`             INT NOT NULL DEFAULT 1,
  `carId`            VARCHAR(50) NOT NULL,
  `carName`          VARCHAR(255) NOT NULL,
  `carCategory`      VARCHAR(100) NOT NULL,
  `totalPrice`       INT NOT NULL DEFAULT 0,
  `status`           ENUM('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
  `createdAt`        DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`createdAt`),
  INDEX `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ═══════════════════════════════════════════════════════
-- إذا كان الجدول موجوداً مسبقاً أضف الأعمدة الجديدة:
-- ═══════════════════════════════════════════════════════
-- ALTER TABLE `bookings` ADD COLUMN `pickupTime`  VARCHAR(10) NOT NULL DEFAULT '09:00' AFTER `pickupDate`;
-- ALTER TABLE `bookings` ADD COLUMN `dropoffTime` VARCHAR(10) NOT NULL DEFAULT '09:00' AFTER `dropoffDate`;
