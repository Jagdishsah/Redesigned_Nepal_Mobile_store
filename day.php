<?php
// Modernized Secure PHP Backend Handler for Nepal Mobile Store
header('Content-Type: application/json; charset=utf-8');

$server = "localhost";
$user = "root";
$password = "";
$db_name = "day";

// Create MySQL Connection
$conn = new mysqli($server, $user, $password, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Extract and sanitize input
$name = isset($_POST['username']) ? trim($_POST['username']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$pwd = isset($_POST['password']) ? $_POST['password'] : '';

if (empty($name) || empty($email) || empty($pwd)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields (username, email, password) are required."]);
    $conn->close();
    exit();
}

// Hash password securely
$hashed_password = password_hash($pwd, PASSWORD_DEFAULT);

// Use Prepared Statements to prevent SQL Injection
$stmt = $conn->prepare("INSERT INTO daya (Name, Address, Password) VALUES (?, ?, ?)");
if ($stmt) {
    $stmt->bind_param("sss", $name, $email, $hashed_password);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Registration successful! Account created."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to insert record: " . $stmt->error]);
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Table or statement preparation failed: " . $conn->error]);
}

$conn->close();
?>