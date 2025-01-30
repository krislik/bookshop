<?php
session_start();
include 'db.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $order = json_decode($json, true);

    if (!$order) {
        echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // Insert into orders table
        $stmt = $pdo->prepare("INSERT INTO orders (customer_name, customer_address, total, payment_method) VALUES (?, ?, ?, ?)");
        $stmt->execute([$order['customer']['name'], $order['customer']['address'], $order['total'], $order['paymentMethod']]);
        $orderId = $pdo->lastInsertId();

        // Insert order items
        $stmt = $pdo->prepare("INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)");
        foreach ($order['items'] as $item) {
            $stmt->execute([$orderId, $item['id'], $item['quantity'], $item['price']]);
        }

        $pdo->commit();
        echo json_encode(["status" => "success", "orderId" => $orderId]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>

