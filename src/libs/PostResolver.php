<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

function getPostData() {
    global $logger;
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

    if ($contentType === "application/json") {
        $data = trim(file_get_contents("php://input"));
        $decrypted = json_decode($data, true);

        if (!is_array($decrypted)) {
            $logger->error("Post decrypt failed!");
        } else {
            return $decrypted;
        }
    } else {
        $logger->error("Content-Type is not 'application/json'!");
        return null;
    }
}