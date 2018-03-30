<?php

// Include confi.php
include_once('config.php');

if($_SERVER['REQUEST_METHOD'] == "POST"){
	// Get data
	$name = isset($_POST['name']) ? mysqli_real_escape_string($conn, $_POST['name']) : "";
	$email = isset($_POST['email']) ? mysqli_real_escape_string($conn,$_POST['email']) : "";
	$password = isset($_POST['pwd']) ? mysqli_real_escape_string($conn, $_POST['pwd']) : "";
	$status = isset($_POST['status']) ? mysqli_real_escape_string($conn, $_POST['status']) : "";

	// Insert data into data base
	$sql = "INSERT INTO `tuts_rest`.`users` (`ID`, `name`, `email`, `password`, `status`) VALUES (NULL, '$name', '$email', '$password', '$status');";
	$qur = mysqli_query($conn, $sql);
	if($qur){
		$json = array("status" => 1, "msg" => "Done User added!");
	}else{
		$json = array("status" => 0, "msg" => "Error adding user!");
	}
}else{
	$json = array("status" => 0, "msg" => "Request method not accepted");
}

@mysqli_close($conn);

/* Output header */
	header('Content-type: application/json');
	echo json_encode($json);