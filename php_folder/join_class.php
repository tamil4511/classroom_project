<?php
include 'connection.php';
session_start();
$email = $_SESSION['email'];
if(isset($_POST['join_class'])) {
    $joincode = mysqli_real_escape_string($con, $_POST['classcode']); // Sanitize input
    $query2 = "SELECT * FROM classroom WHERE code='$joincode' AND email='$email'";
    $result2 = mysqli_query($con, $query2);
    if($result2 && mysqli_num_rows($result2) > 0) {
        $res = [
            "status" => 400,
            "message" => "You are already a member of this class"
        ];
        header('Content-Type: application/json');
        echo json_encode($res);
        return;
    }
    $query = "SELECT * FROM classroom WHERE code='$joincode'";
    $result = mysqli_query($con, $query);
    if($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        if($row['code'] == $_POST['classcode'] && $row['type'] == "create") {
            $tdata = "join";
            $creator = mysqli_real_escape_string($con, $row['creator']);
            $class_name = mysqli_real_escape_string($con, $row['class_name']);
            $profile = mysqli_real_escape_string($con, $row['profile']);
            $query1 = "INSERT INTO classroom(email, code, creator, class_name, profile, type) VALUES ('$email', '$joincode', '$creator', '$class_name', '$profile', '$tdata')";
            $result1 = mysqli_query($con, $query1);
            if($result1) {
                $res = [
                    "status" => 200,
                    "message" => "Class joined successfully"
                ];
            } else {
                $res = [
                    "status" => 500,
                    "message" => "Error joining class: " . mysqli_error($con)
                ];
            }
        } else {
            $res = [
                "status" => 500,
                "message" => "Class not found or invalid type"
            ];
        }
    } else {
        $res = [
            "status" => 500,
            "message" => "Class not found"
        ];
    }
    header('Content-Type: application/json');
    echo json_encode($res);
}
?>
