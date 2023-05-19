<?php
  header('Access-Control-Allow-Origin: *');

  header('Access-Control-Allow-Methods: GET, POST');
  
  header("Access-Control-Allow-Headers: X-Requested-With");

  function clean($string) {
    $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
 
    return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
  }

  $name = clean($_REQUEST["username"]);
  $userfile = './data/login/' . $name . '.json';
  $json = file_get_contents($userfile);
  if ($json) {
    print("{\"status\": \"fail\"}");
    die();
  }

  $json = array();
  $json["password"] = hash("sha512", $_REQUEST["password"]);

  $token = bin2hex(random_bytes(1024));
  $json["token"] = $token;

  file_put_contents($userfile, json_encode($json));

  mkdir("data/files/".$name."/mobs", 0777, true);
  file_put_contents("data/files/".$name."/mobs/_index.json", "[]");
  mkdir("data/files/".$name."/encounters", 0777, true);
  file_put_contents("data/files/".$name."/encounters/_index.json", "[]");
  mkdir("data/files/".$name."/spells", 0777, true);
  file_put_contents("data/files/".$name."/spells/_index.json", "[]");
  mkdir("data/files/".$name."/other", 0777, true);
  file_put_contents("data/files/".$name."/other/campains.json", "[]");

  print("{\"status\": \"success\", \"data\": {\"token\": \"" . $token . "\", \"username\": \"" . $_REQUEST["username"] . "\"}}");
  die();
?>