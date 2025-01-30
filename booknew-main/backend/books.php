<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Connect to the database
$conn = new mysqli("localhost", "root", "", "bookshop");

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Fetch books from the database
$sql = "SELECT * FROM books";
$result = $conn->query($sql);

$books = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
}

// Return JSON response
echo json_encode($books);

// Close connection
$conn->close();
?>
