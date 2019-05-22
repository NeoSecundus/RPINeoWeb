<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

function RESTGateway() {
    global $logger;
    $url = $_SERVER['REQUEST_URI'];
    $view = new MainView();

    if (explode("/", $url)[1] == "resources") {
        if (is_file(BASEPATH . $url)) {
            includeResource($url);
        } else {
            echo "File Not Found!";
        }
        die();
    }

    switch($url) {
        case '/':
            $logger->info("Loading Home-Page");
            $view->buildPage("home.html");
            break;

        default:
            $logger->info("Unknown Page");
            $view->buildPage("404.html");
    }
}

function includeResource($url) {
    $fileType = explode(".", $url);
    $fileType = $fileType[sizeof($fileType)-1];

    $contentHeader = "text/plain";

    foreach (array_keys(config['resourceTypes']) as $key) {
        if ($key == $fileType) {
            $contentHeader = config['resourceTypes'][$key];
            break;
        }
    }

    header('Content-Type: ' . $contentHeader);
    include(BASEPATH . $url);
}