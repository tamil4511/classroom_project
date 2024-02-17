<?php
include 'connection.php';
session_start();
if(isset($_POST['login'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];
    $query = "SELECT * FROM users WHERE email='$email' and password='$password'";
    $result = mysqli_query($con, $query);
    if(mysqli_num_rows($result) > 0) {
        $res = [
            "status" => 200,
            $_SESSION['email'] = $email,
            "message" => "Login successful"
        ];
    } else {
        $res = [
            "status" => 400,
            "message" => "Invalid credentials"
        ];
    }

    header('Content-Type: application/json'); // Set Content-Type header
    echo json_encode($res);
}



if(isset($_POST['logout']))
{
    session_destroy();
// Provide a response of successful logout
$response = [
    'status' => 200,
    'message' => 'Logout successful',
];

echo json_encode($response);
return;
}
?>
