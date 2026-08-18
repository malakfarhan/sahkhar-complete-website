<?php
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

// 1. Fetch all locations
if ($method === 'GET') {
    $stmt = getDB()->query("SELECT * FROM locations ORDER BY isMain DESC, id DESC");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formatting booleans and JSON arrays for React
    foreach ($rows as &$r) {
        $r['isMain'] = (bool)$r['isMain'];
        $r['active'] = (bool)$r['active'];
        $r['lat'] = (float)$r['lat'];
        $r['lng'] = (float)$r['lng'];
        // Agar services JSON string hai toh usay decode kar dein
        if (!empty($r['services'])) {
            $r['services'] = json_decode($r['services'], true) ?: [];
        } else {
            $r['services'] = [];
        }
    }
    
    ok($rows);
}

// 2. Handle Add / Update / Delete
if ($method === 'POST') {
    $b = body();
    $action = $b['action'] ?? '';

    // Add new location
    if ($action === 'add') {
        $id = 'loc_' . time() . '_' . rand(100, 999);
        $servicesJson = json_encode($b['services'] ?? []);

        $stmt = getDB()->prepare(
            "INSERT INTO locations (id, city, cityEn, branch, branchEn, address, addressEn, phone, hours, hoursEn, lat, lng, mapUrl, description, descriptionEn, services, isMain, active) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)"
        );
        $stmt->execute([
            $id,
            $b['city'] ?? '',
            $b['cityEn'] ?? '',
            $b['branch'] ?? '',
            $b['branchEn'] ?? '',
            $b['address'] ?? '',
            $b['addressEn'] ?? '',
            $b['phone'] ?? '',
            $b['hours'] ?? '',
            $b['hoursEn'] ?? '',
            (float)($b['lat'] ?? 0),
            (float)($b['lng'] ?? 0),
            $b['mapUrl'] ?? '',
            $b['description'] ?? '',
            $b['descriptionEn'] ?? '',
            $servicesJson,
            !empty($b['isMain']) ? 1 : 0
        ]);
        ok(['id' => $id]);
    }

    // Update existing location
    if ($action === 'update') {
        $servicesJson = json_encode($b['services'] ?? []);

        $stmt = getDB()->prepare(
            "UPDATE locations 
             SET city=?, cityEn=?, branch=?, branchEn=?, address=?, addressEn=?, phone=?, hours=?, hoursEn=?, lat=?, lng=?, mapUrl=?, description=?, descriptionEn=?, services=?, isMain=?, active=? 
             WHERE id=?"
        );
        $stmt->execute([
            $b['city'] ?? '',
            $b['cityEn'] ?? '',
            $b['branch'] ?? '',
            $b['branchEn'] ?? '',
            $b['address'] ?? '',
            $b['addressEn'] ?? '',
            $b['phone'] ?? '',
            $b['hours'] ?? '',
            $b['hoursEn'] ?? '',
            (float)($b['lat'] ?? 0),
            (float)($b['lng'] ?? 0),
            $b['mapUrl'] ?? '',
            $b['description'] ?? '',
            $b['descriptionEn'] ?? '',
            $servicesJson,
            !empty($b['isMain']) ? 1 : 0,
            !empty($b['active']) ? 1 : 0,
            $b['id']
        ]);
        ok();
    }

    // Delete location
    if ($action === 'delete') {
        $stmt = getDB()->prepare("DELETE FROM locations WHERE id=?");
        $stmt->execute([$b['id']]);
        ok();
    }

    fail('unknown action');
}

fail('method not allowed', 405);