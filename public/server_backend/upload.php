<?php
error_reporting(E_ALL);
  include "./data/headers.php";
  include "./data/checkCredentials.php";

  $validTypes = array("mobs", "encounters", "other", "spells");

  $val = checkCredentials($_REQUEST);
  if ($val && in_array($_REQUEST["type"], $validTypes)) {
    if ($_REQUEST["group"] === "public" && isAdmin($_REQUEST)) {
      $file = "../publicResources/" . clean($_REQUEST["source"]) . "/" . clean($_REQUEST["name"]) . ".json";
      file_put_contents($file, $_REQUEST["content"]);
      print("{\"result\": \"success\"}");
      exit;
    }
    if ($_REQUEST["group"] === "private") {
      $baseFile = "data/files/" . clean($_REQUEST["username"]) . "/" . clean($_REQUEST["type"]) . "/";
      $name = clean($_REQUEST["name"]);
      file_put_contents($baseFile . $name . ".json", $_REQUEST["content"]);

      if ($_REQUEST["idx_data"] != "") {
        $indxData = json_decode($_REQUEST["idx_data"]);
        $indxData->file = $name;

        $index_file = $baseFile . "_index.json";
        $index = json_decode(file_get_contents($index_file));
        
        $present = false;
        foreach ($index as &$idx) {
          if ($idx->file == $name) {
            $present = true;
            $idx = $indxData;
            break;
          }
        }

        if (!$present) {
          array_push($index, $indxData);
        }

        file_put_contents($index_file, json_encode($index, JSON_PRETTY_PRINT));
      }
      print("{\"result\": \"success\"}");
      exit;
    }
  }
  print("{\"result\": \"failed\"}");
?>