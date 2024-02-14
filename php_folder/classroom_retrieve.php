<?php
include 'connection.php';
session_start();

if(isset($_POST['classroom_retrieve'])) {
    $email = $_SESSION['email'];
    $dtype = "create"; // Add a semicolon here
    $query = "SELECT * FROM classroom WHERE email='$email'";
    $result = mysqli_query($con, $query);

    if($result) {
        if(mysqli_num_rows($result) > 0) {
            $res = [
                "status" => 200,
                "message" => "Classes retrieved successfully",
                "data" => []
            ];
            while($row = mysqli_fetch_assoc($result)) {
                $res['data'][] = $row;
            }
        } else {
            $res = [
                "status" => 400,
                "message" => "No classes found"
            ];
        }
    } else {
        $res = [
            "status" => 500,
            "message" => "Error retrieving classes: " . mysqli_error($con)
        ];
    }

    header('Content-Type: application/json'); // Set Content-Type header
    echo json_encode($res);
}
?>
