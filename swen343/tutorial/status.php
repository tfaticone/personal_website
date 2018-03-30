<?php

// Include confi.php
include_once('config.php');

if($_SERVER['REQUEST_METHOD'] == "POST"){
    $uid = isset($_POST['uid']) ? mysqli_real_escape_string($conn, $_POST['uid']) : "";
    $status = isset($_POST['status']) ? mysqli_real_escape_string($conn, $_POST['status']) : "";

    // Add your validations
    if(!empty($uid)){
        $qur = mysqli_query($conn, "UPDATE  `tuts_rest`.`users` SET  `status` =  '$status' WHERE  `users`.`ID` ='$uid';");
        if($qur){
            $json = array("status" => 1, "msg" => "Status updated!!.");
        }else{
            $json = array("status" => 0, "msg" => "Error updating status");
        }
    }else{
        $json = array("status" => 0, "msg" => "User ID not define");
    }
}else{
    $json = array("status" => 0, "msg" => "User ID not define");
}
@mysqli_close($conn);

/* Output header */
header('Content-type: application/json');
echo json_encode($json);