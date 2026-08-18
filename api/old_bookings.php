<?php
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $where = [];
    $params = [];

    if (!empty($_GET['status']) && in_array($_GET['status'], ['pending','completed','cancelled'])) {
        $where[] = "status = ?";
        $params[] = $_GET['status'];
    }
    if (!empty($_GET['date'])) {
        $where[] = "DATE(createdAt) = ?";
        $params[] = $_GET['date'];
    }
    if (!empty($_GET['search'])) {
        $s = '%' . $_GET['search'] . '%';
        $where[] = "(name LIKE ? OR phone LIKE ? OR carName LIKE ?)";
        $params[] = $s; $params[] = $s; $params[] = $s;
    }

    $sql = "SELECT * FROM bookings";
    if ($where) $sql .= " WHERE " . implode(" AND ", $where);
    $sql .= " ORDER BY createdAt DESC";

    $stmt = getDB()->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    foreach ($rows as &$r) {
        $r['totalPrice'] = (int)$r['totalPrice'];
        $r['days']       = (int)$r['days'];
    }
    ok($rows);
}

if ($method === 'POST') {
    $b = body();
    $action = $b['action'] ?? 'add';

    // ── حفظ حجز جديد ──────────────────────────────────────────────
    if ($action === 'add') {
        $id = 'BK-' . strtoupper(substr(md5(uniqid()), 0, 8));
        $stmt = getDB()->prepare(
            "INSERT INTO bookings
             (id, name, phone, idNumber, email, notes,
              pickupLocation, dropoffLocation,
              pickupDate, pickupTime, dropoffDate, dropoffTime, days,
              carId, carName, carCategory,
              totalPrice, status, createdAt)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())"
        );
        $stmt->execute([
            $id,
            $b['name'], $b['phone'], $b['idNumber'],
            $b['email'] ?? '', $b['notes'] ?? '',
            $b['pickupLocation'], $b['dropoffLocation'],
            $b['pickupDate'], $b['pickupTime'] ?? '09:00',
            $b['dropoffDate'], $b['dropoffTime'] ?? '09:00',
            (int)$b['days'],
            $b['carId'], $b['carName'], $b['carCategory'],
            (int)$b['totalPrice'],
            'pending',
        ]);

        // ── إرسال إيميل للإدارة ──────────────────────────────────
        sendBookingEmail($id, $b);

        ok(['id' => $id]);
    }

    // ── تحديث الحالة ──────────────────────────────────────────────
    if ($action === 'update-status') {
        if (!in_array($b['status'], ['pending','completed','cancelled'])) fail('حالة غير صحيحة');
        getDB()->prepare("UPDATE bookings SET status=? WHERE id=?")
               ->execute([$b['status'], $b['id']]);
        ok();
    }

    // ── حذف طلب ──────────────────────────────────────────────────
    if ($action === 'delete') {
        getDB()->prepare("DELETE FROM bookings WHERE id=?")->execute([$b['id']]);
        ok();
    }

    fail('unknown action');
}

fail('method not allowed', 405);

// ─── دالة الإيميل ─────────────────────────────────────────────────────────────
function sendBookingEmail(string $bookingId, array $b): void {
    $to      = ADMIN_EMAIL;
    $subject = "=?UTF-8?B?" . base64_encode("طلب حجز جديد #{$bookingId}") . "?=";

    $days       = (int)$b['days'];
    $totalPrice = (int)$b['totalPrice'];
    $email      = $b['email'] ?? 'غير محدد';
    $notes      = $b['notes'] ?? 'لا يوجد';

    $body = "
<!DOCTYPE html>
<html dir='rtl' lang='ar'>
<head><meta charset='UTF-8'></head>
<body style='font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;direction:rtl'>
  <div style='max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)'>
    <div style='background:#3d1a06;color:#fff;padding:24px 32px;text-align:center'>
      <h1 style='margin:0;font-size:22px'>🚗 طلب حجز جديد</h1>
      <p style='margin:8px 0 0;color:#d4a017;font-size:16px;font-weight:bold'>#{$bookingId}</p>
    </div>
    <div style='padding:32px'>
      <h2 style='color:#3d1a06;border-bottom:2px solid #f0e0c0;padding-bottom:10px'>بيانات العميل</h2>
      <table style='width:100%;border-collapse:collapse'>
        <tr><td style='padding:8px 0;color:#666;width:140px'>الاسم:</td><td style='padding:8px 0;font-weight:bold'>{$b['name']}</td></tr>
        <tr><td style='padding:8px 0;color:#666'>رقم الجوال:</td><td style='padding:8px 0;font-weight:bold'>{$b['phone']}</td></tr>
        <tr><td style='padding:8px 0;color:#666'>رقم الهوية:</td><td style='padding:8px 0;font-weight:bold'>{$b['idNumber']}</td></tr>
        <tr><td style='padding:8px 0;color:#666'>البريد الإلكتروني:</td><td style='padding:8px 0'>{$email}</td></tr>
      </table>

      <h2 style='color:#3d1a06;border-bottom:2px solid #f0e0c0;padding-bottom:10px;margin-top:24px'>تفاصيل الحجز</h2>
      <table style='width:100%;border-collapse:collapse'>
        <tr><td style='padding:8px 0;color:#666;width:140px'>السيارة:</td><td style='padding:8px 0;font-weight:bold'>{$b['carName']}</td></tr>
        <tr><td style='padding:8px 0;color:#666'>الفئة:</td><td style='padding:8px 0'>{$b['carCategory']}</td></tr>
        <tr><td style='padding:8px 0;color:#666'>مكان الاستلام:</td><td style='padding:8px 0'>{$b['pickupLocation']}</td></tr>
        <tr><td style='padding:8px 0;color:#666'>مكان التسليم:</td><td style='padding:8px 0'>{$b['dropoffLocation']}</td></tr>
        <tr><td style='padding:8px 0;color:#666'>تاريخ ووقت الاستلام:</td><td style='padding:8px 0;font-weight:bold'>{$b['pickupDate']} — {$b['pickupTime']}</td></tr>
        <tr><td style='padding:8px 0;color:#666'>تاريخ ووقت التسليم:</td><td style='padding:8px 0;font-weight:bold'>{$b['dropoffDate']} — {$b['dropoffTime']}</td></tr>
        <tr><td style='padding:8px 0;color:#666'>عدد الأيام:</td><td style='padding:8px 0'>{$days} يوم</td></tr>
      </table>

      <div style='background:#3d1a06;color:#fff;border-radius:12px;padding:16px 24px;margin-top:24px;text-align:center'>
        <div style='color:#d4a017;font-size:13px;margin-bottom:4px'>إجمالي المبلغ</div>
        <div style='font-size:28px;font-weight:bold'>{$totalPrice} ريال</div>
      </div>

      " . ($notes !== 'لا يوجد' ? "<div style='background:#fffbf0;border:1px solid #f0e0c0;border-radius:10px;padding:14px 18px;margin-top:16px'><strong>ملاحظات العميل:</strong><br>{$notes}</div>" : "") . "

      <p style='color:#999;font-size:12px;margin-top:24px;text-align:center'>
        تم استلام هذا الطلب عبر موقع صخر لتأجير السيارات
      </p>
    </div>
  </div>
</body>
</html>";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: =?UTF-8?B?" . base64_encode("صخر لتأجير السيارات") . "?= <no-reply@" . ($_SERVER['HTTP_HOST'] ?? 'sakhr.com') . ">\r\n";

    @mail($to, $subject, $body, $headers);
}
