<?php

$method = $_SERVER['REQUEST_METHOD'];

    //Get JSON Object
$str = file_get_contents('users.json');
$json = json_decode($str, true);

//Get post data
$rawdata = json_decode(file_get_contents('php://input'), true);
if($method == "POST" && $rawdata["action"] == "login" && !empty($rawdata["username"]) && !empty($rawdata["password"])) {
    if(array_key_exists($rawdata["username"], $json["users"]) && $json["users"][$rawdata["username"]]["password"] == $rawdata["password"]){
        echo json_encode(array('message' => 'Logged In', 'status' => true, 'user' => $json["users"][$rawdata["username"]]));
    } else {
        echo json_encode(array('message' => 'Incorrect Username or Password', 'status' => false));
    }
} elseif ($method == "POST" && $rawdata["action"] == "create" && !empty($rawdata["username"]) && !empty($rawdata["password"])) {
    if(!array_key_exists($rawdata["username"], $json["users"])){
        $json["users"][$rawdata["username"]] = array("password" => $rawdata["password"], "favorites" => []);
        file_put_contents('users.json',json_encode($json));
        echo json_encode(array('message' => 'saved', 'status' => true, 'user' => $json["users"][$rawdata["username"]]));
    } else {
        echo json_encode(array('message' => 'Account exists with that username', 'status' => false));
    }
} elseif ($method == "POST" && $rawdata["action"] == "addfavorite" && !empty($rawdata["username"]) && !empty($rawdata["favorites"])) {
    if(array_key_exists($rawdata["username"], $json["users"])){
        $json["users"][$rawdata["username"]]["favorites"] = $rawdata["favorites"];
        file_put_contents('users.json',json_encode($json));
        echo json_encode(array('message' => 'saved', 'status' => true, 'user' => $json["users"][$rawdata["username"]]));
    } else {
        echo json_encode(array('message' => 'No account exists with that username', 'status' => false));
    }
} elseif ($method == "POST" && $rawdata["action"] == "getfavorite" && !empty($rawdata["username"])) {
    if(!array_key_exists($rawdata["username"], $json["users"])){
        echo json_encode(array('message' => '', 'status' => true, 'favorites' => $json["users"][$rawdata["username"]]["favorites"]));
    } else {
        echo json_encode(array('message' => 'No account exists with that username', 'status' => false));
    }
}else {
    echo json_encode(array('message' => 'Missing arguments', 'status' => false));
}