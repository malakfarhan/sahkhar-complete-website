<?php
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = getDB()->query("SELECT * FROM locations ORDER BY city, branch")->fetchAll();
    foreach ($rows as &$r) {
        $r['lat']      = (float)$r['lat'];
        $r['lng']      = (float)$r['lng'];
        $r['isMain']   = (bool)$r['isMain'];
        $r['active']   = (bool)$r['active'];
        $r['services'] = json_decode($r['services'], true) ?? [];
        $r['mapUrl']   = $r['mapUrl']   ?? '';
        $r['mapEmbed'] = $r['mapEmbed'] ?? '';
    }
    ok($rows);
}

if ($method === 'POST') {
    $b = body();
    $action = $b['action'] ?? '';

    if ($action === 'add') {
        $id = 'loc_' . time() . '_' . rand(100,999);
        $stmt = getDB()->prepare(
            "INSERT INTO locations (id,city,branch,address,phone,hours,isMain,lat,lng,mapUrl,mapEmbed,description,services,active)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
        );
        $stmt->execute([
            $id, $b['city'], $b['branch'], $b['address'],
            $b['phone'], $b['hours'],
            $b['isMain'] ? 1 : 0,
            (float)$b['lat'], (float)$b['lng'],
            $b['mapUrl']   ?? '',
            $b['mapEmbed'] ?? '',
            $b['description'],
            json_encode($b['services'] ?? [], JSON_UNESCAPED_UNICODE),
            $b['active'] ? 1 : 0,
        ]);
        ok(['id' => $id]);
    }

    if ($action === 'update') {
        $stmt = getDB()->prepare(
            "UPDATE locations SET city=?,branch=?,address=?,phone=?,hours=?,isMain=?,lat=?,lng=?,mapUrl=?,mapEmbed=?,description=?,services=?,active=? WHERE id=?"
        );
        $stmt->execute([
            $b['city'], $b['branch'], $b['address'],
            $b['phone'], $b['hours'],
            $b['isMain'] ? 1 : 0,
            (float)$b['lat'], (float)$b['lng'],
            $b['mapUrl']   ?? '',
            $b['mapEmbed'] ?? '',
            $b['description'],
            json_encode($b['services'] ?? [], JSON_UNESCAPED_UNICODE),
            $b['active'] ? 1 : 0,
            $b['id'],
        ]);
        ok();
    }

    if ($action === 'delete') {
        getDB()->prepare("DELETE FROM locations WHERE id=?")->execute([$b['id']]);
        ok();
    }

    fail('unknown action');
}

fail('method not allowed', 405);
