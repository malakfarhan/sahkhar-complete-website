<?php
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Exclude password field for security
    $rows = getDB()->query("SELECT id, username, role, createdAt FROM users ORDER BY createdAt")->fetchAll();
    ok($rows);
}

if ($method === 'POST') {
    $b = body();
    $action = $b['action'] ?? '';

    if ($action === 'add') {
        $check = getDB()->prepare("SELECT id FROM users WHERE username=?");
        $check->execute([$b['username']]);
        if ($check->fetch()) fail('اسم المستخدم موجود مسبقاً');

        $hashedPassword = password_hash($b['password'], PASSWORD_DEFAULT);

        $id = 'user_' . time() . '_' . rand(100, 999);
        $stmt = getDB()->prepare(
            "INSERT INTO users (id, username, password, role, createdAt) VALUES (?, ?, ?, ?, NOW())"
        );
        $stmt->execute([$id, $b['username'], $hashedPassword, $b['role']]);
        ok(['id' => $id]);
    }

    if ($action === 'delete') {
        if ($b['id'] === 'root') fail('لا يمكن حذف المشرف الرئيسي');
        getDB()->prepare("DELETE FROM users WHERE id=?")->execute([$b['id']]);
        ok();
    }

    if ($action === 'update-password') {
        if (empty($b['password']) || strlen($b['password']) < 4) {
            fail('كلمة المرور يجب أن تكون 4 أحرف على الأقل');
        }
        $hashedPassword = password_hash($b['password'], PASSWORD_DEFAULT);
        getDB()->prepare("UPDATE users SET password=? WHERE id=?")->execute([$hashedPassword, $b['id']]);
        ok();
    }

    fail('unknown action');
}

fail('method not allowed', 405);