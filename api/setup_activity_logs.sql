-- Create Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  log_id VARCHAR(50) UNIQUE,
  action_type VARCHAR(50) NOT NULL,
  description TEXT,
  username VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id VARCHAR(100),
  entity_details JSON,
  booking_id VARCHAR(50),
  old_value VARCHAR(255),
  new_value VARCHAR(255),
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_action_type (action_type),
  INDEX idx_entity_type (entity_type),
  INDEX idx_booking_id (booking_id),
  INDEX idx_created_at (created_at),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Run this file once in phpMyAdmin before deploying the activity-log feature.
