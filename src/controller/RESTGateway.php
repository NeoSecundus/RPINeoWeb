<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

function RESTGateway() {
    global $logger;
    $url = $_SERVER['REQUEST_URI'];
    $view = new MainView();
    $uManager = new UserManager();

    if (explode("/", $url)[1] == "resources") {
        if (is_file(BASEPATH . $url)) {
            $view->sendResource($url);
        } else {
            echo "File Not Found!";
        }
        die();
    }

    if ($url == "/trylogin") {
        $uManager->login();
        die();
    }
    if ($url == "/tryregister") {
        $uManager->register();
        die();
    }

    if (isset($_COOKIE['raspiControl_login'])) {
        if (!$uManager->checkUser(json_decode($_COOKIE['raspiControl_login'], true))) {
            $view->sendPage('/denied.html');
            die();
        }
    } else {
        if ($url == "/register") {
            include_once("src/includes/html/register.html");
        } else {
            include_once("src/includes/html/login.html");
        }
        die();
    }

    switch($url) {
        case "/":
            $logger->info("Loading Home-Page");
            $view->buildPage();
            break;
        case "/getusers":
            $logger-> info("Requesting users!");
            echo json_encode($uManager->getUsers());
            break;
        case "/adduser":
            $logger->info("Adding new User!");
            $uManager->addUser();
            break;
        case "/removeuser":
            $logger->info("Removing User!");
            $uManager->removeUser();
            break;
        default:
            $logger->info("Requesting page " . $url);
            $view->sendPage($url);
    }
}