<?php
include 'connection.php';
session_start();
$email = $_SESSION['email'];
if(isset($_POST['unenroll']))
{
    $classname=$_POST['classname'];

    $query = "SELECT * FROM classroom WHERE email='$email' AND class_name='$classname' AND type='create'";
    $result = mysqli_query($con, $query);
    if(mysqli_num_rows($result) > 0)
    {
        $query = "DELETE FROM classroom WHERE class_name='$classname'";
        $result = mysqli_query($con, $query);
        $query1 = "DELETE FROM class_data where class_name='$classname'";
        $result1 = mysqli_query($con, $query1);
        $query2 = "DELETE FROM comments where class_name='$classname'";
        $result2 = mysqli_query($con, $query2);
        if($result && $result1 && $result2)
        {
            $res=[
                'status'=>200,
                'message'=>'Class Deleted Successfully',
            ];
        }
        else
        {
            $res=[
                'status'=>400,
                'message'=>'Class not Deleted',
            ];
        }
        echo json_encode($res);
    }
    else
    {
        $query = "DELETE FROM classroom WHERE email='$email' AND class_name='$classname' AND type='join'";
        $result = mysqli_query($con, $query);
        if($result)
        {
            $res=[
                'status'=>200,
                'message'=>'Unenrolled Successfully',
            ];
        }
        else
        {
            $res=[
                'status'=>400,
                'message'=>'Unenroll failed',
            ];
        }
        echo json_encode($res);
    }
}
?>
