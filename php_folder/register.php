<?php
include 'connection.php';
if(isset($_POST['register']))
{
    $username = $_POST['username'];
    $password = $_POST['password'];
    $email = $_POST['email'];
    $query = "SELECT * FROM users WHERE username='$username'";
    $result1 = mysqli_query($con, $query);
    if(mysqli_num_rows($result1) > 0)
    {
        $res=[
            "status"=>400,
            "message"=>"Username already exists"];
        echo json_encode($res);
        exit();
        
    }
    $query = "INSERT INTO users (username, password, email) VALUES ('$username', '$password', '$email')";
    $result = mysqli_query($con, $query);
    if($result)
    {
       // echo "User registered successfully";
        $res=[
            "status"=>200,
            "message"=>"Registered successfully",
        ];
        echo json_encode($res);
    }
    else
    {
        echo "Failed to register user";
    }
}
?>