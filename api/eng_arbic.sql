-- ═══════════════════════════════════════════════════════
-- COMPLETE DATABASE SETUP - SAKHER CAR RENTAL
-- Run this in phpMyAdmin on Bluehost
-- ═══════════════════════════════════════════════════════

SET NAMES utf8mb4;

-- ── 1️⃣ CARS TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS `cars` (
  `id`           INT AUTO_INCREMENT PRIMARY KEY,
  `name`         VARCHAR(255) NOT NULL,
  `nameEn`       VARCHAR(255) NOT NULL,
  `category`     VARCHAR(100) NOT NULL,
  `categoryEn`   VARCHAR(100) NOT NULL DEFAULT '',
  `dailyPrice`   INT NOT NULL DEFAULT 0,
  `seats`        INT NOT NULL DEFAULT 5,
  `transmission` VARCHAR(100) NOT NULL DEFAULT 'أوتوماتيك',
  `fuel`         VARCHAR(100) NOT NULL DEFAULT 'بنزين',
  `year`         INT NOT NULL DEFAULT 2024,
  `features`     TEXT NOT NULL,
  `image`        TEXT NOT NULL,
  `available`    TINYINT(1) NOT NULL DEFAULT 1,
  `active`       TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 2️⃣ LOCATIONS TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS `locations` (
  `id`          VARCHAR(100) PRIMARY KEY,
  `city`        VARCHAR(255) NOT NULL,
  `cityEn`      VARCHAR(255) NOT NULL DEFAULT '',
  `branch`      VARCHAR(255) NOT NULL,
  `branchEn`    VARCHAR(255) NOT NULL DEFAULT '',
  `address`     TEXT NOT NULL,
  `addressEn`   TEXT NOT NULL DEFAULT '',
  `phone`       VARCHAR(50) NOT NULL,
  `hours`       VARCHAR(100) NOT NULL,
  `hoursEn`     VARCHAR(100) NOT NULL DEFAULT '',
  `isMain`      TINYINT(1) NOT NULL DEFAULT 0,
  `lat`         DECIMAL(10,7) NOT NULL DEFAULT 0,
  `lng`         DECIMAL(10,7) NOT NULL DEFAULT 0,
  `mapUrl`      TEXT DEFAULT '',
  `description` TEXT NOT NULL,
  `descriptionEn` TEXT NOT NULL DEFAULT '',
  `services`    TEXT NOT NULL,
  `active`      TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 3️⃣ SLIDES TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS `slides` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `bg`         TEXT NOT NULL,
  `badge`      VARCHAR(255) NOT NULL,
  `badgeEn`    VARCHAR(255) NOT NULL DEFAULT '',
  `heading`    VARCHAR(500) NOT NULL,
  `headingEn`  VARCHAR(500) NOT NULL DEFAULT '',
  `sub`        TEXT NOT NULL,
  `subEn`      TEXT NOT NULL DEFAULT '',
  `ctaLabel`   VARCHAR(255) NOT NULL,
  `ctaLabelEn` VARCHAR(255) NOT NULL DEFAULT '',
  `ctaHref`    VARCHAR(500) NOT NULL,
  `cta2Label`  VARCHAR(255) NOT NULL,
  `cta2LabelEn` VARCHAR(255) NOT NULL DEFAULT '',
  `active`     TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 4️⃣ USERS TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`        VARCHAR(100) PRIMARY KEY,
  `username`  VARCHAR(255) UNIQUE NOT NULL,
  `password`  VARCHAR(255) NOT NULL,
  `role`      ENUM('superadmin','admin') NOT NULL DEFAULT 'admin',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 5️⃣ BOOKINGS TABLE ──────────────────────────────────
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

-- ── 6️⃣ ACTIVITY LOGS TABLE ─────────────────────────────
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `log_id` VARCHAR(50) UNIQUE,
  `action_type` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `username` VARCHAR(100),
  `entity_type` VARCHAR(50),
  `entity_id` VARCHAR(100),
  `entity_details` JSON,
  `booking_id` VARCHAR(50),
  `old_value` VARCHAR(255),
  `new_value` VARCHAR(255),
  `ip_address` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_action_type` (`action_type`),
  INDEX `idx_entity_type` (`entity_type`),
  INDEX `idx_booking_id` (`booking_id`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 7️⃣ DEFAULT DATA ────────────────────────────────────

-- Cars Data
INSERT IGNORE INTO `cars` (`name`,`nameEn`,`category`,`categoryEn`,`dailyPrice`,`seats`,`transmission`,`fuel`,`year`,`features`,`image`,`available`,`active`) VALUES
('تويوتا كامري','Toyota Camry','اقتصادية','Economy',150,5,'أوتوماتيك','بنزين',2024,'["مكيف هواء","بلوتوث","كاميرا خلفية","نظام ملاحة"]','/images/car-camry.png',1,1),
('تويوتا كورولا','Toyota Corolla','اقتصادية','Economy',120,5,'أوتوماتيك','بنزين',2024,'["مكيف هواء","بلوتوث","كاميرا خلفية"]','/images/car-corolla.png',1,1),
('هيونداي أكسنت','Hyundai Accent','اقتصادية','Economy',100,5,'أوتوماتيك','بنزين',2024,'["مكيف هواء","بلوتوث"]','/images/car-corolla.png',1,1),
('تويوتا لاند كروزر','Toyota Land Cruiser','SUV','SUV',400,7,'أوتوماتيك','بنزين',2024,'["دفع رباعي","نظام ملاحة","شاشات خلفية","مقاعد جلد"]','/images/car-landcruiser.png',1,1),
('تويوتا هايلاندر','Toyota Highlander','SUV','SUV',280,7,'أوتوماتيك','بنزين',2024,'["دفع رباعي","كاميرا 360","مقاعد جلد"]','/images/car-landcruiser.png',1,1),
('نيسان باترول','Nissan Patrol','SUV','SUV',380,7,'أوتوماتيك','بنزين',2024,'["دفع رباعي","نظام ملاحة","كاميرا خلفية","مقاعد جلد"]','/images/car-landcruiser.png',0,1),
('GMC يوكون','GMC Yukon','SUV','SUV',350,8,'أوتوماتيك','بنزين',2024,'["دفع رباعي","شاشات ترفيه","صف ثالث","مقاعد جلد"]','/images/car-yukon.png',1,1),
('لكزس ES','Lexus ES','فاخرة','Luxury',450,5,'أوتوماتيك','هجين',2024,'["نظام صوتي ماركنتون","مقاعد تدفئة","نظام ملاحة","كاميرا 360"]','/images/car-lexus.png',1,1),
('مرسيدس E-Class','Mercedes E-Class','فاخرة','Luxury',550,5,'أوتوماتيك','بنزين',2024,'["مقاعد كهربائية","تحكم بالرائحة","نظام قيادة نصف أوتوماتيك","كاميرا 360"]','/images/car-lexus.png',1,1),
('تويوتا كوستر','Toyota Coaster','ميني باص','Minibus',600,22,'مانيوال','ديزل',2024,'["مكيف هواء","مقاعد مريحة","نوافذ كبيرة"]','/images/car-yukon.png',1,1),
('هيونداي H1','Hyundai H1','ميني باص','Minibus',350,12,'أوتوماتيك','بنزين',2024,'["مكيف هواء","مقاعد جلد","بلوتوث"]','/images/car-yukon.png',1,1);

-- Locations Data
INSERT IGNORE INTO `locations` (`id`,`city`,`cityEn`,`branch`,`branchEn`,`address`,`addressEn`,`phone`,`hours`,`hoursEn`,`isMain`,`lat`,`lng`,`mapUrl`,`description`,`descriptionEn`,`services`,`active`) VALUES
('riyadh-main','الرياض','Riyadh','الفرع الرئيسي','Main Branch','الرياض','Riyadh','920017014','8:00 ص - 10:00 م','8:00 AM - 10:00 PM',1,24.7275519,46.7655743,'','المقر الرئيسي لشركة صخر لتأجير السيارات في الرياض','Sakhr Car Rental main headquarters in Riyadh','["تسليم واستلام السيارات","خدمة التوصيل للمطار","خدمة الشركات","صيانة طارئة"]',1),
('riyadh-qairawan','الرياض','Riyadh','فرع القيروان','Al-Qairawan Branch','حي القيروان، الرياض','Al-Qairawan District, Riyadh','920017014','8:00 ص - 10:00 م','8:00 AM - 10:00 PM',0,24.8492722,46.572742,'','فرع صخر في حي القيروان شمال الرياض','Sakhr branch in Al-Qairawan district north of Riyadh','["تسليم واستلام السيارات","خدمة التوصيل","خدمة الشركات"]',1),
('riyadh-uqaiq','الرياض','Riyadh','فرع العقيق','Al-Uqaiq Branch','حي العقيق، الرياض','Al-Uqaiq District, Riyadh','920017014','8:00 ص - 10:00 م','8:00 AM - 10:00 PM',0,24.7895899,46.6212964,'','فرع صخر في حي العقيق غرب الرياض','Sakhr branch in Al-Uqaiq district west of Riyadh','["تسليم واستلام السيارات","خدمة التوصيل","تأجير للمجموعات"]',1),
('riyadh-shifa','الرياض','Riyadh','فرع الشفاء','Al-Shifa Branch','حي الشفاء، الرياض','Al-Shifa District, Riyadh','920017014','8:00 ص - 10:00 م','8:00 AM - 10:00 PM',0,24.5454964,46.7127038,'','فرع صخر في حي الشفاء جنوب الرياض','Sakhr branch in Al-Shifa district south of Riyadh','["تسليم واستلام السيارات","خدمة التوصيل","خدمة الشركات"]',1),
('ras-tanura','رأس تنورة','Ras Tanura','فرع رأس تنورة','Ras Tanura Branch','رأس تنورة، المنطقة الشرقية','Ras Tanura, Eastern Province','920017014','8:00 ص - 10:00 م','8:00 AM - 10:00 PM',0,26.7081668,50.0656479,'','فرع صخر في رأس تنورة لخدمة عملاء المنطقة الشرقية','Sakhr branch in Ras Tanura serving Eastern Province customers','["تسليم واستلام السيارات","خدمة الشركات","خدمة التوصيل"]',1),
('jeddah-1','جدة','Jeddah','فرع جدة الأول','Jeddah Branch 1','جدة','Jeddah','920017014','8:00 ص - 10:00 م','8:00 AM - 10:00 PM',0,21.5817322,39.1975231,'','فرع صخر الأول في جدة لخدمة عملاء المنطقة الغربية','Sakhr first branch in Jeddah serving Western Province customers','["تسليم واستلام السيارات","خدمة التوصيل للمطار","تأجير للمجموعات"]',1),
('jeddah-2','جدة','Jeddah','فرع جدة الثاني','Jeddah Branch 2','جدة','Jeddah','920017014','8:00 ص - 10:00 م','8:00 AM - 10:00 PM',0,21.5362646,39.2142087,'','فرع صخر الثاني في جدة لخدمة جنوب المدينة','Sakhr second branch in Jeddah serving south of the city','["تسليم واستلام السيارات","خدمة التوصيل","خدمة الشركات"]',1);

-- Slides Data
INSERT IGNORE INTO `slides` (`bg`,`badge`,`badgeEn`,`heading`,`headingEn`,`sub`,`subEn`,`ctaLabel`,`ctaLabelEn`,`ctaHref`,`cta2Label`,`cta2LabelEn`,`active`,`sort_order`) VALUES
('/images/hero-bg.png','أسطول متنوع وحديث','Diverse Modern Fleet','رحلتك تبدأ من صخـر','Your Journey Starts with Sakhr','اختر من بين أفضل السيارات الاقتصادية والعائلية والفاخرة بأسعار تنافسية تناسب جميع الميزانيات','Choose from the best economy, family, and luxury cars at competitive prices for every budget','احجز الآن','Book Now','/#/booking','تصفح الأسطول','Browse Fleet',1,0),
('/images/car-landcruiser.png','SUV فاخرة','Luxury SUVs','ادخل البراري بثقة','Enter the Desert with Confidence','لاند كروزر، باترول، هايلاندر، يوكون — أقوى الـ SUV بدفع رباعي وتجهيزات كاملة لكل رحلة','Land Cruiser, Patrol, Highlander, Yukon — the most powerful 4WD SUVs with complete features for every journey','اكتشف الـ SUV','Discover SUVs','/#/cars','احجز الآن','Book Now',1,1),
('/images/car-lexus.png','سيارات فاخرة','Luxury Vehicles','الفخامة في كل تفصيل','Luxury in Every Detail','مرسيدس E-Class، لكزس ES — تجربة قيادة لا مثيل لها لرجال الأعمال والمناسبات الرسمية','Mercedes E-Class, Lexus ES — an unmatched driving experience for business professionals and formal occasions','السيارات الفاخرة','Luxury Cars','/#/cars','احجز الآن','Book Now',1,2),
('/images/car-camry.png','عروض خاصة','Special Offers','خصومات حصرية لا تفوتك','Exclusive Discounts Not to Miss','خصم 20% على الحجوزات الأسبوعية — كيلومترات غير محدودة — اليوم الأول مجاناً مع الإيجار الشهري','20% discount on weekly bookings — unlimited kilometers — first day free with monthly rental','احجز واستفد','Book & Save','/#/booking','العروض كاملة','View All Offers',1,3);

-- Users Data
INSERT IGNORE INTO `users` (`id`,`username`,`password`,`role`) VALUES
('root','admin','1234','superadmin');

-- ═══════════════════════════════════════════════════════
-- ✅ DONE! Database is ready with all English fields
-- ═══════════════════════════════════════════════════════