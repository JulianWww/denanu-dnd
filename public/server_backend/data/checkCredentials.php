<?php
  function clean($string) {
    $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.

    return preg_replace('/[^A-Za-z0-9_\-]/', '', $string); // Removes special chars.
  };
  function checkCredentials($creds) {
    $userfile = './data/login/' . clean($creds["username"]) . '.json';
    $json = file_get_contents($userfile);
    if ($json) {
      $json = json_decode($json, true);

      if ($json["token"] === $creds["token"]){
        return true;
      }
    }
    return false;
  }

  function isAdmin($creds) {
    $userfile = './data/login/' . clean($creds["username"]) . '.json';
    $json = file_get_contents($userfile);
    if ($json) {
      $json = json_decode($json, true);

      if (isset($json["admin"]) && $json["admin"]){
        return true;
      }
    }
    return false;
  }

  function genToken() {
    return bin2hex(random_bytes(1024));
  }
?>