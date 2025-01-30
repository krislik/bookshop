<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Database connection
$conn = new mysqli("localhost", "root", "", "bookshop");

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Get JSON data from frontend
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["username"]) || !isset($data["password"])) {
    die(json_encode(["error" => "Missing required fields"]));
}

$username = $data["username"];
$password = password_hash($data["password"], PASSWORD_DEFAULT); // Secure hashing

// Check if user already exists
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["error" => "Username already exists!"]);
} else {
    // Insert new user
    $sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $username, $password);

    if ($stmt->execute()) {
        echo json_encode(["success" => "Registration successful!"]);
    } else {
        echo json_encode(["error" => "Failed to register user: " . $stmt->error]);
    }
}

// Close connection
$conn->close();
?>
