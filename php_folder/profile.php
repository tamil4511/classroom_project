<?php
include 'connection.php';
session_start();
$email = $_SESSION['email'];

if(isset($_POST['password'])) {
    $password = $_POST['newpassword'];
    $oldpassword= $_POST['oldpassword'];
    $query = "SELECT * FROM users WHERE email = '$email'";
    $result = mysqli_query($con, $query);
    $row = mysqli_fetch_assoc($result);
    if($row['password'] != $oldpassword) {
        $res = [
            "status" => 400,
            "error" => "Old password is incorrect"
        ];
        echo json_encode($res);
        return;
    }
    $query = "UPDATE users SET password = '$password' WHERE email = '$email'";
    $result = mysqli_query($con, $query);
    if($result) {
        $res = [
            "status" => 200,
            "message" => "Password updated successfully"
        ];
        echo json_encode($res);
    } else {
        $res = [
            "status" => 500,
            "error" => "Error updating password: " . mysqli_error($con)
        ];
        echo json_encode($res);
    }
}

if (isset($_POST['uploadImage'])) {
    // Retrieve user's current profile image from the database
    $query = "SELECT profile FROM users WHERE email = '$email'";
    $result = mysqli_query($con, $query);
    $row = mysqli_fetch_assoc($result);
    $oldImage = $row['profile'];

    // Delete the old profile image file from the server
    if ($oldImage && file_exists("../userprofile/$oldImage")) {
        unlink("../userprofile/$oldImage");
    }

    // Upload the new profile image
    $name = $_FILES['profileImage']['name'];
    $target_dir = "../userprofile/";
    $target_file = $target_dir . basename($_FILES["profileImage"]["name"]);
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    $extensions_arr = array("jpg", "jpeg", "png", "gif");

    if (in_array($imageFileType, $extensions_arr)) {
        // Update the database with the new profile image file name
        $query = "UPDATE users SET profile = '$name' WHERE email = '$email'";
        $result = mysqli_query($con, $query);
        $query1 = "UPDATE comments SET profile = '$name' WHERE email = '$email'";
        $result1 = mysqli_query($con, $query1);
        if ($result) {
            // Move the new uploaded image file to the appropriate directory on the server
            move_uploaded_file($_FILES['profileImage']['tmp_name'], $target_dir . $name);
            $res = [
                'status' => 200,
                'message' => 'Image uploaded successfully.'
            ];
            echo json_encode($res);
        } else {
            $res = [
                'status' => 500,
                'message' => 'Error updating profile image: ' . mysqli_error($con)
            ];
            echo json_encode($res);
        }
    } else {
        $res = [
            'status' => 400,
            'message' => 'Image not uploaded. Invalid file type.'
        ];
        echo json_encode($res);
    }
}

if(isset($_POST['profile_retrieve'])) {
    $query = "SELECT * FROM users WHERE email = '$email'";
    $result = mysqli_query($con, $query);
    $row = mysqli_fetch_assoc($result);
    $res = [
        "status" => 200,
        "data" => $row
    ];
    echo json_encode($res);
}
?>
