<?php
session_start();
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $book_id = $_POST['book_id'];
    $_SESSION['cart'][] = $book_id;
    echo json_encode(["status" => "success"]);
}
?>