<?php
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $isPublic = isset($_GET['public']) && $_GET['public'] === 'true';
    
    if ($isPublic) {
        $rows = getDB()->query("SELECT * FROM cars WHERE available = 1 AND active = 1 ORDER BY id DESC")->fetchAll();
    } else {
        $rows = getDB()->query("SELECT * FROM cars ORDER BY id DESC")->fetchAll();
    }
    
    foreach ($rows as &$r) {
        $r['id']         = (int)$r['id'];
        $r['dailyPrice'] = (float)$r['dailyPrice'];
        $r['seats']      = (int)$r['seats'];
        $r['year']       = (int)$r['year'];
        $r['available']  = (bool)$r['available'];
        $r['active']     = (bool)$r['active'];
        
        if (!empty($r['features'])) {
            $decoded = json_decode($r['features'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $r['features'] = $decoded;
            }
        }

        if ($isPublic) {
            // ✅ Frontend: pickupTime + dropoffTime bhi lao
            $bStmt = getDB()->prepare(
                "SELECT id, status, pickupDate, pickupTime, dropoffDate, dropoffTime
                 FROM bookings 
                 WHERE carId = ? 
                 AND status IN ('pending', 'completed')
                 AND dropoffDate >= CURDATE()
                 ORDER BY createdAt DESC 
                 LIMIT 10"
            );
        } else {
            // ✅ Dashboard: pickupTime + dropoffTime bhi lao
            $bStmt = getDB()->prepare(
                "SELECT id, status, pickupDate, pickupTime, dropoffDate, dropoffTime
                 FROM bookings 
                 WHERE carId = ? 
                 ORDER BY createdAt DESC 
                 LIMIT 5"
            );
        }

        $bStmt->execute([$r['id']]);
        $bookings = $bStmt->fetchAll();

        $activeBookings = [];
        foreach ($bookings as $b) {
            $dropoffDate = trim((string)($b['dropoffDate'] ?? ''));
            if ($dropoffDate !== '') {
                $dropoffTs = strtotime($dropoffDate . ' 23:59:59');
                $todayTs = strtotime('today');
                if ($dropoffTs < $todayTs) {
                    continue;
                }
            }
            $activeBookings[] = $b;
        }

        $r['bookingSummary'] = [
            'pending'   => 0,
            'confirmed' => 0,
            'completed' => 0,
            'cancelled' => 0,
        ];

        foreach ($activeBookings as $b) {
            $status = $b['status'];
            if (isset($r['bookingSummary'][$status])) {
                $r['bookingSummary'][$status]++;
            }
        }

        $r['recentBookings'] = $activeBookings;
    }
    ok($rows);
}

if ($method === 'POST') {
    $b = body();
    $action = $b['action'] ?? '';

    $processBase64Image = function($imgData) {
        if (!empty($imgData) && strpos($imgData, 'data:image/') === 0) {
            list($type, $data) = explode(';', $imgData);
            list(, $data)      = explode(',', $data);
            $data = base64_decode($data);
            
            if ($data !== false) {
                $extension = 'png';
                if (strpos($type, 'jpeg') !== false || strpos($type, 'jpg') !== false) {
                    $extension = 'jpg';
                } elseif (strpos($type, 'webp') !== false) {
                    $extension = 'webp';
                }
                
                $fileName = 'car_' . time() . '_' . rand(1000, 9999) . '.' . $extension;
                $uploadFileDir = __DIR__ . '/../public/images/';
                
                if (!is_dir($uploadFileDir)) {
                    mkdir($uploadFileDir, 0755, true);
                }
                
                $dest_path = $uploadFileDir . $fileName;
                if (file_put_contents($dest_path, $data)) {
                    return '/images/' . $fileName;
                }
            }
        }
        return $imgData;
    };

    if ($action === 'add') {
        $imagePath = $processBase64Image($b['image'] ?? '');
        $features = isset($b['features']) ? (is_array($b['features']) ? json_encode($b['features'], JSON_UNESCAPED_UNICODE) : $b['features']) : '[]';

        $stmt = getDB()->prepare(
            "INSERT INTO cars (name, nameEn, category, categoryEn, dailyPrice, seats, transmission, fuel, year, features, image, available, active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $b['name'] ?? '',
            $b['nameEn'] ?? '',
            $b['category'] ?? '',
            $b['categoryEn'] ?? '',
            $b['dailyPrice'] ?? 0,
            $b['seats'] ?? 4,
            $b['transmission'] ?? 'أوتوماتيك',
            $b['fuel'] ?? 'بنزين',
            $b['year'] ?? 2026,
            $features,
            $imagePath,
            isset($b['available']) && $b['available'] ? 1 : 0,
            isset($b['active']) && $b['active'] ? 1 : 0,
        ]);
        ok(['id' => (int)getDB()->lastInsertId(), 'image' => $imagePath]);
    }

    if ($action === 'update') {
        $id = (int)$b['id'];
        
        $stmtOld = getDB()->prepare("SELECT image FROM cars WHERE id=?");
        $stmtOld->execute([$id]);
        $oldCar = $stmtOld->fetch();

        $imagePath = $processBase64Image($b['image'] ?? '');
        
        if ($imagePath !== ($oldCar['image'] ?? '')) {
            if ($oldCar && !empty($oldCar['image']) && strpos($oldCar['image'], 'data:') === false) {
                $oldFilePath = __DIR__ . '/../public' . $oldCar['image'];
                if (file_exists($oldFilePath)) {
                    @unlink($oldFilePath);
                }
            }
        }

        $features = isset($b['features']) ? (is_array($b['features']) ? json_encode($b['features'], JSON_UNESCAPED_UNICODE) : $b['features']) : '[]';

        $stmt = getDB()->prepare(
            "UPDATE cars SET name=?, nameEn=?, category=?, categoryEn=?, dailyPrice=?, seats=?, transmission=?, fuel=?, year=?, features=?, image=?, available=?, active=? WHERE id=?"
        );
        $stmt->execute([
            $b['name'] ?? '',
            $b['nameEn'] ?? '',
            $b['category'] ?? '',
            $b['categoryEn'] ?? '',
            $b['dailyPrice'] ?? 0,
            $b['seats'] ?? 4,
            $b['transmission'] ?? 'أوتوماتيك',
            $b['fuel'] ?? 'بنزين',
            $b['year'] ?? 2026,
            $features,
            $imagePath,
            isset($b['available']) && $b['available'] ? 1 : 0,
            isset($b['active']) && $b['active'] ? 1 : 0,
            $id,
        ]);
        ok(['image' => $imagePath]);
    }

    if ($action === 'delete') {
        $id = (int)$b['id'];
        
        $stmtOld = getDB()->prepare("SELECT image FROM cars WHERE id=?");
        $stmtOld->execute([$id]);
        $oldCar = $stmtOld->fetch();
        
        if ($oldCar && !empty($oldCar['image']) && strpos($oldCar['image'], 'data:') === false) {
            $oldFilePath = __DIR__ . '/../public' . $oldCar['image'];
            if (file_exists($oldFilePath)) {
                @unlink($oldFilePath);
            }
        }

        getDB()->prepare("DELETE FROM cars WHERE id=?")->execute([$id]);
        ok();
    }

    fail('unknown action');
}

fail('method not allowed', 405);