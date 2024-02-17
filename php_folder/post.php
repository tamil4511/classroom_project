<?php
include 'connection.php';
session_start();
$email = $_SESSION['email'];

if (isset($_POST['post'])) {
    // Get the title, classname, and creator from the form
    $title = $_POST['title'];
    $classname = $_POST['classname']; // Retrieve classname from the form
    $creator = $_POST['creator']; // Retrieve creator from the form

    // Specify the destination directory for the file uploads
    $destination_dir = '../posts/';

    // Get the file name
    $filename = $_FILES['sfile']['name'];

    // Set the destination path for the uploaded file
    $destination_path = $destination_dir . $filename;

    // Move the uploaded file to the destination directory
    if (move_uploaded_file($_FILES['sfile']['tmp_name'], $destination_path)) {
        // File moved successfully, now insert the title into the database
        // First, sanitize the title to prevent SQL injection
        $sanitized_title = mysqli_real_escape_string($con, $title);

        // Get the current date and time
        $current_date = date('Y-m-d H:i:s');

        $query1="SELECT * FROM users WHERE email = '$email'";
        $result1 = mysqli_query($con, $query1);
        $data1 = mysqli_fetch_assoc($result1);
        $people = $data1['username'];

        // Construct and execute the SQL query to insert the title into the table
        $query = "INSERT INTO class_data (title, email, class_name, date, data, creator,people) 
                  VALUES ('$sanitized_title', '$email', '$classname', '$current_date', '$destination_path', '$creator','$people')";
        $result = mysqli_query($con, $query);

        if ($result) {
            // Title inserted successfully
            $res = array(
                "status" => 200,
                "message" => "Title inserted successfully"
            );
            echo json_encode($res); // Return success status as JSON
        } else {
            // Error inserting title
            $res = array(
                "status" => 500,
                "error" => "Error inserting title."
            );
            echo json_encode($res); // Return error status as JSON
        }
    } else {
        // Error moving file
        $res = array(
            "status" => 500,
            "error" => "Error uploading file."
        );
        echo json_encode($res); // Return error status as JSON
    }
}


if(isset($_POST['retrieve_post']))
{
    $classname = $_POST['classname'];
    $query1="SELECT * FROM users WHERE email = '$email'";
    $result1 = mysqli_query($con, $query1);
    $data1 = mysqli_fetch_assoc($result1);
    $people = $data1['username'];
    
    $query = "SELECT * FROM class_data WHERE class_name = '$classname'";
    $result = mysqli_query($con, $query);
    $data = array();
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $row['class_name'] = $classname;
            $query2 = "SELECT * FROM comments WHERE class_name = '$classname' AND title = '".$row['title']."'";
            $result2 = mysqli_query($con, $query2);
            $query3 = "SELECT profile FROM users WHERE email = '".$row['email']."'";
            $result3 = mysqli_query($con, $query3);
            $data3 = mysqli_fetch_assoc($result3);
            $row['profile'] = $data3['profile'];
            $row['comments'] = array();
            while ($comment = mysqli_fetch_assoc($result2)) {
                $row['comments'][] = $comment;
            }
            $data[] = $row;
            
        }
       $res=[
        "status"=>200,
        "data"=>$data,
        "username"=>$people,
        "userprofile"=>$data1['profile'],
        "message"=>"Data found successfully."
       ];
         echo json_encode($res);
    } else {
        $res=[
            "status"=>500,
            "username"=>$people,
            "message"=>"Data not found."
           ];
             echo json_encode($res);
    }
}


if(isset($_POST['comment'])) {
    $comment = $_POST['comment_data'];
    $classname = $_POST['classname'];
    $title = $_POST['post_title'];
    $date = date('Y-m-d H:i:s');
    $query1="SELECT * FROM users WHERE email = '$email'";
    $result1 = mysqli_query($con, $query1);
    $data1 = mysqli_fetch_assoc($result1);
    $people = $data1['username'];
    $profile = $data1['profile'];
    $query = "INSERT INTO comments (email, class_name, title, comment, date,comment_name,profile) VALUES ('$email', '$classname', '$title', '$comment', '$date','$people','$profile')";
    $result = mysqli_query($con, $query);
    if ($result) {
        // Comment inserted successfully
        $res = [
            "status" => 200,
            "message" => "Comment inserted successfully",
        ];
        echo json_encode($res); // Return success status as JSON
    } else {
        // Error inserting comment
        $res = [
            "status" => 500,
            "error" => "Error inserting comment."
        ];
        echo json_encode($res); // Return error status as JSON
    }
}



if(isset($_POST['delete_post']))
{
    $id=$_POST['postId'];
    $query1="SELECT * FROM class_data WHERE id = '$id'";
    $result1 = mysqli_query($con, $query1);
    $data1 = mysqli_fetch_assoc($result1);
    $classname = $data1['class_name'];
    $title = $data1['title'];
    $query="DELETE FROM class_data WHERE id='$id'";
    $result=mysqli_query($con,$query);
    $query2="DELETE FROM comments WHERE class_name='$classname' AND title='$title'";
    $result2=mysqli_query($con,$query2);
    if($result && $result2)
    {
        $res=[
            "status"=>200,
            "message"=>"Post deleted successfully."
        ];
        echo json_encode($res);
    }
    else
    {
        $res=[
            "status"=>500,
            "message"=>"Post not deleted."
        ];
        echo json_encode($res);
    }

}

if(isset($_POST['delete_comment']))
{
    $id=$_POST['commentId'];
    $query="DELETE FROM comments WHERE id='$id'";
    $result=mysqli_query($con,$query);
    if($result)
    {
        $res=[
            "status"=>200,
            "message"=>"Comment deleted successfully."
        ];
        echo json_encode($res);
    }
    else
    {
        $res=[
            "status"=>500,
            "message"=>"Comment not deleted."
        ];
        echo json_encode($res);
    }

}
?>
