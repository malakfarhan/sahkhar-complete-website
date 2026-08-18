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

    if ($action === 'add') {
        $maxOrder = getDB()->query("SELECT MAX(sort_order) FROM slides")->fetchColumn() ?? 0;
        $stmt = getDB()->prepare(
            "INSERT INTO slides (bg,badge,heading,sub,ctaLabel,ctaHref,cta2Label,active,sort_order)
             VALUES (?,?,?,?,?,?,?,?,?)"
        );
        $stmt->execute([
            $b['bg'], $b['badge'], $b['heading'], $b['sub'],
            $b['ctaLabel'], $b['ctaHref'], $b['cta2Label'],
            $b['active'] ? 1 : 0,
            (int)$maxOrder + 1,
        ]);
        ok(['id' => (int)getDB()->lastInsertId()]);
    }

    if ($action === 'update') {
        $stmt = getDB()->prepare(
            "UPDATE slides SET bg=?,badge=?,heading=?,sub=?,ctaLabel=?,ctaHref=?,cta2Label=?,active=? WHERE id=?"
        );
        $stmt->execute([
            $b['bg'], $b['badge'], $b['heading'], $b['sub'],
            $b['ctaLabel'], $b['ctaHref'], $b['cta2Label'],
            $b['active'] ? 1 : 0,
            (int)$b['id'],
        ]);
        ok();
    }

    if ($action === 'delete') {
        getDB()->prepare("DELETE FROM slides WHERE id=?")->execute([(int)$b['id']]);
        ok();
    }

    fail('unknown action');
}

fail('method not allowed', 405);
