<?php
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = getDB()->query("SELECT * FROM slides ORDER BY sort_order, id")->fetchAll();
    foreach ($rows as &$r) {
        $r['id']     = (int)$r['id'];
        $r['active'] = (bool)$r['active'];
    }
    ok($rows);
}

if ($method === 'POST') {
    $b = body();
    $action = $b['action'] ?? '';

    // Function to handle base64 image conversion and saving
    $processBase64Image = function($bgData) {
        if (!empty($bgData) && strpos($bgData, 'data:image/') === 0) {
            // Extract the base64 data
            list($type, $data) = explode(';', $bgData);
            list(, $data)      = explode(',', $data);
            $data = base64_decode($data);
            
            if ($data !== false) {
                // Get extension from mime type (e.g., image/png -> png)
                $extension = 'png';
                if (strpos($type, 'jpeg') !== false || strpos($type, 'jpg') !== false) {
                    $extension = 'jpg';
                } elseif (strpos($type, 'webp') !== false) {
                    $extension = 'webp';
                }
                
                $fileName = 'slide_' . time() . '_' . rand(1000, 9999) . '.' . $extension;
                $uploadFileDir = __DIR__ . '/../public/images/';
                
                if (!is_dir($uploadFileDir)) {
                    mkdir($uploadFileDir, 0755, true);
                }
                
                $dest_path = $uploadFileDir . $fileName;
                if (file_put_contents($dest_path, $data)) {
                    return '/images/' . $fileName; // Return clean path
                }
            }
        }
        return $bgData; // Agar base64 nahi hai toh wahi purana path rehne do
    };

    if ($action === 'add') {
        $bgPath = $processBase64Image($b['bg'] ?? '');
        
        $maxOrder = getDB()->query("SELECT MAX(sort_order) FROM slides")->fetchColumn() ?? 0;
        $stmt = getDB()->prepare(
            "INSERT INTO slides (bg, badge, badgeEn, heading, headingEn, sub, subEn, ctaLabel, ctaLabelEn, ctaHref, cta2Label, cta2LabelEn, active, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $bgPath, 
            $b['badge'] ?? '', 
            $b['badgeEn'] ?? '', 
            $b['heading'] ?? '', 
            $b['headingEn'] ?? '', 
            $b['sub'] ?? '',
            $b['subEn'] ?? '',
            $b['ctaLabel'] ?? '', 
            $b['ctaLabelEn'] ?? '', 
            $b['ctaHref'] ?? '', 
            $b['cta2Label'] ?? '',
            $b['cta2LabelEn'] ?? '',
            $b['active'] ? 1 : 0,
            (int)$maxOrder + 1,
        ]);
        ok(['id' => (int)getDB()->lastInsertId(), 'bg' => $bgPath]);
    }

    if ($action === 'update') {
        $id = (int)$b['id'];
        
        // Purani image ka path check karo taake agar nayi image aaye toh purani file delete kar sakein
        $stmtOld = getDB()->prepare("SELECT bg FROM slides WHERE id=?");
        $stmtOld->execute([$id]);
        $oldSlide = $stmtOld->fetch();

        $bgPath = $processBase64Image($b['bg'] ?? '');
        
        // Agar nayi image save ho gayi aur purani wali base64 nahi thi, toh purani file delete kar do
        if ($bgPath !== ($oldSlide['bg'] ?? '')) {
            if ($oldSlide && !empty($oldSlide['bg']) && strpos($oldSlide['bg'], 'data:') === false) {
                $oldFilePath = __DIR__ . '/../public' . $oldSlide['bg'];
                if (file_exists($oldFilePath)) {
                    @unlink($oldFilePath);
                }
            }
        }

        $stmt = getDB()->prepare(
            "UPDATE slides SET bg=?, badge=?, badgeEn=?, heading=?, headingEn=?, sub=?, subEn=?, ctaLabel=?, ctaLabelEn=?, ctaHref=?, cta2Label=?, cta2LabelEn=?, active=?, sort_order=? WHERE id=?"
        );
        $stmt->execute([
            $bgPath, 
            $b['badge'] ?? '', 
            $b['badgeEn'] ?? '', 
            $b['heading'] ?? '', 
            $b['headingEn'] ?? '', 
            $b['sub'] ?? '',
            $b['subEn'] ?? '',
            $b['ctaLabel'] ?? '', 
            $b['ctaLabelEn'] ?? '', 
            $b['ctaHref'] ?? '', 
            $b['cta2Label'] ?? '',
            $b['cta2LabelEn'] ?? '',
            $b['active'] ? 1 : 0,
            (int)($b['sort_order'] ?? 0),
            $id,
        ]);
        ok(['bg' => $bgPath]);
    }

    if ($action === 'delete') {
        $id = (int)$b['id'];
        
        // Delete karne se pehle physical image file bhi folder se hata do
        $stmtOld = getDB()->prepare("SELECT bg FROM slides WHERE id=?");
        $stmtOld->execute([$id]);
        $oldSlide = $stmtOld->fetch();
        
        if ($oldSlide && !empty($oldSlide['bg']) && strpos($oldSlide['bg'], 'data:') === false) {
            $oldFilePath = __DIR__ . '/../public' . $oldSlide['bg'];
            if (file_exists($oldFilePath)) {
                @unlink($oldFilePath);
            }
        }

        getDB()->prepare("DELETE FROM slides WHERE id=?")->execute([$id]);
        ok();
    }

    fail('unknown action');
}

fail('method not allowed', 405);