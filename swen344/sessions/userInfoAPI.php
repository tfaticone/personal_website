<?php

$method = $_SERVER['REQUEST_METHOD'];

    //Get JSON Object
$str = file_get_contents('users.json');
$json = json_decode($str, true);

//Get post data
$rawdata = json_decode(file_get_contents('php://input'), true);

if($method == "GET" && !empty($_GET["username"])) {
    echo json_encode($json["users"][$_GET["username"]]);
} elseif ($method == "POST" && !empty($rawdata["username"]) && !empty($rawdata["color"]) && !empty($rawdata["food"])) {
    $json["users"][$rawdata["username"]] = ["color" => $rawdata["color"], "food" => $rawdata["food"]];
    file_put_contents('users.json',json_encode($json));
    echo json_encode(['status' => 'saved']);
} else {
    echo json_encode(['status' => 'unfound method']);
}