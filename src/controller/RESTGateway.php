<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

function RESTGateway() {
    global $logger;
    $url = $_SERVER['REQUEST_URI'];
    $view = new MainView();

    if (explode("/", $url)[1] == "resources") {
        if (is_file(BASEPATH . $url)) {
            $view->sendResource($url);
        } else {
            echo "File Not Found!";
        }
        die();
    }

    if ($url == "/") {
        $logger->info("Loading Home-Page");
        $view->buildPage();
    } else {
        $logger->info("Requesting page " . $url);
        $view->sendPageJson($url);
    }
}