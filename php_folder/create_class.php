<?php
include 'connection.php';
session_start();
$email = $_SESSION['email'];
if(isset($_POST['create_class'])) {
    // Get class name and class code
    $classname = $_POST['classname'];
    $classcode = $_POST['classcode'];

    // Destination directory
    $destination_dir = '../classprofile/';

    // Check if the directory exists, if not, create it
    if (!is_dir($destination_dir)) {
        mkdir($destination_dir, 0755, true);
    }

    // Check if a file is uploaded
    if(isset($_FILES['profile_image'])) {
        $file = $_FILES['profile_image'];

        // File properties
        $file_name = $file['name'];
        $file_tmp = $file['tmp_name'];
        $file_size = $file['size'];
        $file_error = $file['error'];

        // Generate unique filename to avoid overwriting existing files
        $file_new_name = uniqid('', true) . '_' . $file_name;
        $file_destination = $destination_dir . $file_new_name;

        // Move uploaded file to the destination
        if(move_uploaded_file($file_tmp, $file_destination)) {
            // File uploaded successfully
            // Proceed with saving class information to your database, etc.
            // For demonstration purposes, let's just echo out some information.
            $query = "SELECT username from users where email = '$email'";
            $result = mysqli_query($con, $query);
            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $username = $row['username'];
                $tdata="create";
                $query1 = "INSERT INTO classroom (email,code,creator,class_name,profile,type) VALUES('$email','$classcode','$username','$classname','$file_destination','$tdata')";
                $result1 = mysqli_query($con, $query1);

                if($result1){
                    $res=[
                        "status"=>200,
                        "message"=>"Class created successfully"
                    ];
                } else {
                    $res=[
                        "status"=>500,
                        "message"=>"Error creating class"
                    ];
                }
            } else {
                $res=[
                    "status"=>500,
                    "message"=>"User not found"
                ];
            }

            // Send JSON response
            header('Content-Type: application/json');
            echo json_encode($res);
            exit; // Ensure no further output is sent
        } else {
            // Error handling
            $res=[
                "status"=>500,
                "message"=>"Error uploading file"
            ];
        }
    } else {
        $res=[
            "status"=>500,
            "message"=>"No file uploaded"
        ];
    }

    
// Send JSON response
header('Content-Type: application/json');
echo json_encode($res);
} else {
    $res=[
        "status"=>500,
        "message"=>"Form submission failed"
    ];
    
// Send JSON response
header('Content-Type: application/json');
echo json_encode($res);
}


?>
