<?php
// ═══════════════════════════════════════════════════
// عدّل هذه القيم بمعلومات قاعدة بياناتك في Bluehost
// ═══════════════════════════════════════════════════


error_reporting(E_ALL);
ini_set('display_errors', 1);

define('DB_HOST', 'localhost');
define('DB_NAME', 'sakher_db'); 
define('DB_USER', 'root');            
define('DB_PASS', '');                
define('DB_CHARSET', 'utf8mb4');

// define('DB_HOST', 'localhost');
// define('DB_NAME', 'alkhoder_sakhar_demo_db'); 
// define('DB_USER', 'alkhoder_sakhar_demo');    
// define('DB_PASS', '8+$ekj@tnLiVcmO=');                
// define('DB_CHARSET', 'utf8mb4');

// ─── بريد الإدارة الذي ستصله طلبات الحجز ───────────────
define('ADMIN_EMAIL', 'malakfarhandeveloper@gmail.com');

function ensureSessionStarted(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params([
            'httponly' => true,
            'samesite' => 'Lax',
            'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        ]);
        session_start();
    }
}

ensureSessionStarted();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
    http_response_code(204); 
    exit; 
}

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
    return $pdo;
}

function ok($data = null): void {
    echo json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE); 
    exit;
}

function fail(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE); 
    exit;
}

function body(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function currentActor(): ?array { 
    return $_SESSION['admin_user'] ?? null; 
}

function requireAdmin(): array {
    $actor = currentActor();
    if (!$actor || empty($actor['id']) || empty($actor['username'])) {
        fail('Authentication required', 401);
    }
    return $actor;
}

function logActivity(
    string $action, 
    string $description, 
    ?array $actor = null, 
    ?string $entityType = null, 
    ?string $entityId = null, 
    ?string $bookingId = null, 
    ?string $oldValue = null, 
    ?string $newValue = null, 
    ?array $details = null
): void {
    try {
        $actor = $actor ?? currentActor();
        $db = getDB();
        $stmt = $db->prepare(
            "INSERT INTO activity_logs (log_id, action_type, description, username, entity_type, entity_id, entity_details, booking_id, old_value, new_value, ip_address, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())"
        );
        $stmt->execute([
            'LOG-' . strtoupper(bin2hex(random_bytes(6))),
            $action,
            $description,
            $actor['username'] ?? 'System',
            $entityType,
            $entityId,
            $details ? json_encode($details, JSON_UNESCAPED_UNICODE) : null,
            $bookingId,
            $oldValue,
            $newValue,
            substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 50),
        ]);
    } catch (Exception $e) {
        // Silently fail if activity_logs table doesn't exist
    }
}