<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('method not allowed', 405);
requireAdmin();

try {
    $where = [];
    $params = [];
    
    if (!empty($_GET['bookingId'])) {
        $where[] = 'booking_id = ?';
        $params[] = substr($_GET['bookingId'], 0, 50);
    }
    
    $limit = min(max((int)($_GET['limit'] ?? 100), 1), 500);
    
    $sql = 'SELECT id, log_id, action_type, description, username, entity_type, entity_id, booking_id, old_value, new_value, created_at 
            FROM activity_logs';
    
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY created_at DESC, id DESC LIMIT ' . $limit;
    
    $stmt = getDB()->prepare($sql);
    $stmt->execute($params);
    $logs = $stmt->fetchAll();
    
    // Format response
    ok([
        'logs' => $logs,
        'count' => count($logs)
    ]);
    
} catch (Exception $e) {
    fail('Database error: ' . $e->getMessage(), 500);
}
?>