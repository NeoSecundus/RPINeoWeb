<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

function RESTGateway() {
    $url = $_SERVER['REQUEST_URI'];
    $uManager = new UserManager();
    $view = new MainView();

    $rootUrl = explode("/", $url)[1];

    if ($rootUrl == "resources") {
        if (is_file(BASEPATH . $url)) {
            $view->sendResource($url);
        } else {
            echo "File Not Found!";
        }
        die();
    }

    if ($rootUrl == "trylogin") {
        $uManager->login(false);
        die();
    }
    if ($rootUrl == "tryremlogin") {
        $uManager->login(true);
        die();
    }
    if ($rootUrl == "tryregister") {
        $uManager->register();
        die();
    }

    if (isset($_COOKIE['raspiControl_login'])) {
        if (!$uManager->checkUser(json_decode($_COOKIE['raspiControl_login'], true))) {
            $view->sendPage('/denied.html');
            die();
        }
        if (isset($_COOKIE['raspiControl_rem'])) {
            setcookie('raspiControl_login', $_COOKIE['raspiControl_login'], time()+259200);
            setcookie("raspiControl_rem", 'NULL', time()+259200);
        }
    } else {
        if ($rootUrl == "register") {
            include_once("src/includes/html/register.html");
        } else {
            include_once("src/includes/html/login.html");
        }
        die();
    }

    switch($rootUrl) {
        case "":
            LOGGER::info("Loading Home-Page");
            $view->buildPage();
            break;
        case "getusers":
            Logger::info("Requesting users!");
            $uManager->checkPrivileges("Admin", true);
            echo json_encode($uManager->getUsers());
            break;
        case "adduser":
            Logger::info("Adding new User!");
            $uManager->checkPrivileges("Admin", true);
            $uManager->addUser();
            break;
        case "removeuser":
            Logger::info("Removing User!");
            $uManager->checkPrivileges("Admin", true);
            $uManager->removeUser();
            break;
        case "resetpassword":
            Logger::info("Resetting user password!");
            $uManager->checkPrivileges("Admin", true);
            $uManager->resetUser();
            break;
        case "changeprivileges":
            Logger::info("Changing privileges!");
            $uManager->checkPrivileges("Admin", true);
            $uManager->changePrivileges();
            break;
        case "getrpidata":
            Logger::info("Requesting Raspi data!");
            echo Monitoring::getRPIData();
            break;
        case "notes":
            Logger::info("Requesting note-manager! ->");
            echo NoteManager::checkRequest($url);
            break;
        case "habits":
            Logger::info("Requesting habit manager! ->");
            echo HabitManager::checkRequest($url);
            break;
        case "nexttheme":
            Logger::info("Setting new Theme!");
            echo $view->nextTheme();
            break;
        case "napchart":
            Logger::info("Requesting NapChart!");
            echo NapChartManager::checkRequest($url);
            break;
        case "wsc":
            Logger::info("Requesting WaterSystem!");
            echo WaterSystem::checkRequest($url);
            break;
        default:
            Logger::info("Requesting page " . $url);
            $view->sendPage($url);
    }
}