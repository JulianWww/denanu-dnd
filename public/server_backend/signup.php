<?php
  include "./data/headers.php";
  include "./data/checkCredentials.php";

  $name = clean($_REQUEST["username"]);
  $userfile = './data/login/' . $name . '.json';

  if (file_exists($userfile)) {
    print("{\"status\": \"fail\", \"reason\": \"uname Exists\"}");
    die();
  }

  $json = array();
  $json["password"] = hash("sha512", $_REQUEST["password"]);
  $json["email"] = $_REQUEST["email"];

  $token = genToken();
  $json["token"] = $token;

  file_put_contents($userfile, json_encode($json, JSON_PRETTY_PRINT));

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