<?php
function login() {
    global $logger;
    $DATA = getPostData();

    if (!isset($DATA["user"]) || !isset($DATA["pass"])) {
        echo json_encode(["status" => "false", "info" => "User or Pass not set in POST!"]);
        die();
    }

    if (checkUser($DATA)) {
        setcookie("raspiControl_login",
            '{"user":"' . $DATA["user"] . '","pass":"' . $DATA["pass"] . '"}');
        echo json_encode(["status"=> "true"]);
    } else {
        echo json_encode(["status" => "false"]);
    }
}

function checkUser($DATA) {
    $users = getUsers();
    if (isset($users[$DATA["user"]])) {
        if (strlen($users[$DATA["user"]]) == 0) {
            $users[$DATA["user"]] = $DATA["pass"];
            setUsers($users);
            return true;
        }
    } else {
        return false;
    }

    if ($users[$DATA["user"]] == $DATA["pass"]) {
        return true;
    }
    return false;
}

function getUsers() {
    global $logger;

    if (is_file("/data/users.txt")) {
        $logger->error("User-File not found!");
        die();
    }

    $contents = file_get_contents(BASEPATH . "/data/users.txt");
    return json_decode($contents, true);
}

function setUsers($users) {
    global $logger;

    if (is_file("/data/users.txt")) {
        $logger->error("User-File not found!");
        die();
    }

    file_put_contents(BASEPATH . "/data/users.txt", json_encode($users));
}