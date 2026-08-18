<?php
require 'config.php';
ensureSessionStarted();

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('method not allowed', 405);

$b = body();

// Trim username and password
$username = trim($b['username'] ?? '');
$password = trim($b['password'] ?? '');

// Check if username and password are not empty
if (!$username || !$password) fail('بيانات غير مكتملة');

// Get user from database
$stmt = getDB()->prepare("SELECT * FROM users WHERE username=?");
$stmt->execute([$username]);
$user = $stmt->fetch();

// Check if user exists and password is correct
if (!$user || !password_verify($password, $user['password'])) {
    fail('اسم المستخدم أو كلمة المرور غير صحيحة');
}

// Remove password before sending response
unset($user['password']);

// Set session
$_SESSION['admin_user'] = [
    'id' => $user['id'],
    'username' => $user['username'],
    'role' => $user['role']
];

// Log activity (if function exists)
if (function_exists('logActivity')) {
    logActivity('admin.login', 'Administrator signed in', $_SESSION['admin_user'], 'user', $user['id']);
}

ok($user);
?>