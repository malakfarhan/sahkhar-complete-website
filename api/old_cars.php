<?php
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = getDB()->query("SELECT * FROM cars ORDER BY id")->fetchAll();
    foreach ($rows as &$r) {
        $r['id']         = (int)$r['id'];
        $r['dailyPrice'] = (int)$r['dailyPrice'];
        $r['seats']      = (int)$r['seats'];
        $r['year']       = (int)$r['year'];
        $r['available']  = (bool)$r['available'];
        $r['active']     = (bool)$r['active'];
        $r['features']   = json_decode($r['features'], true) ?? [];
    }
    ok($rows);
}

if ($method === 'POST') {
    $b = body();
    $action = $b['action'] ?? '';

    if ($action === 'add') {
        $stmt = getDB()->prepare(
            "INSERT INTO cars (name,nameEn,category,dailyPrice,seats,transmission,fuel,year,features,image,available,active)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
        );
        $stmt->execute([
            $b['name'], $b['nameEn'], $b['category'],
            (int)$b['dailyPrice'], (int)$b['seats'],
            $b['transmission'], $b['fuel'], (int)$b['year'],
            json_encode($b['features'] ?? [], JSON_UNESCAPED_UNICODE),
            $b['image'] ?? '',
            $b['available'] ? 1 : 0,
            $b['active'] ? 1 : 0,
        ]);
        ok(['id' => (int)getDB()->lastInsertId()]);
    }

    if ($action === 'update') {
        $stmt = getDB()->prepare(
            "UPDATE cars SET name=?,nameEn=?,category=?,dailyPrice=?,seats=?,transmission=?,fuel=?,year=?,features=?,image=?,available=?,active=? WHERE id=?"
        );
        $stmt->execute([
            $b['name'], $b['nameEn'], $b['category'],
            (int)$b['dailyPrice'], (int)$b['seats'],
            $b['transmission'], $b['fuel'], (int)$b['year'],
            json_encode($b['features'] ?? [], JSON_UNESCAPED_UNICODE),
            $b['image'] ?? '',
            $b['available'] ? 1 : 0,
            $b['active'] ? 1 : 0,
            (int)$b['id'],
        ]);
        ok();
    }

    if ($action === 'delete') {
        getDB()->prepare("DELETE FROM cars WHERE id=?")->execute([(int)$b['id']]);
        ok();
    }

    fail('unknown action');
}

fail('method not allowed', 405);
