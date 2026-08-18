<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('method not allowed', 405);

$b = body();
$username = trim($b['username'] ?? '');
$password = trim($b['password'] ?? '');

if (!$username || !$password) fail('بيانات غير مكتملة');

$stmt = getDB()->prepare("SELECT * FROM users WHERE username=? AND password=?");
$stmt->execute([$username, $password]);
$user = $stmt->fetch();

if (!$user) fail('اسم المستخدم أو كلمة المرور غير صحيحة');

unset($user['password']);
ok($user);
