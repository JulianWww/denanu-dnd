<?php
  header('Access-Control-Allow-Origin: *');

  header('Access-Control-Allow-Methods: GET, POST');
  
  header("Access-Control-Allow-Headers: X-Requested-With");
  include "./data/checkCredentials.php";

  $userfile = './data/login/' . clean($_REQUEST["username"]) . '.json';
  $json = file_get_contents($userfile);
  if ($json) {
    $json = json_decode($json, true);

    if ($json["password"] === hash("sha512", $_REQUEST["password"])){
      $token = genToken();
      $json["token"] = $token;
      file_put_contents($userfile, json_encode($json, JSON_PRETTY_PRINT));
      print("{\"status\": \"success\", \"data\": {\"token\": \"" . $token . "\", \"username\": \"" . $_REQUEST["username"] . "\"}}");
      die();
    }
  }
  print("{\"status\": \"fail\"}");
  
?>