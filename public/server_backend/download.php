<?php
  header('Access-Control-Allow-Origin: *');

  header('Access-Control-Allow-Methods: GET, POST');
  
  header("Access-Control-Allow-Headers: X-Requested-With");

  include "./data/checkCredentials.php";

  $val = checkCredentials($_REQUEST);
  if ($val) {
    $file = "./data/files/" . clean($_REQUEST["username"]) . "/" . clean($_REQUEST["group"]) . "/";
    if (isset($_REQUEST["name"])) {
      $file = $file . clean($_REQUEST["name"]) . ".json";
    }
    else {
      $file = $file . "_index.json";
    }
    print(file_get_contents($file));
  }
?>