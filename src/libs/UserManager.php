<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

class UserManager {
    private $DATA;
    private $logger;

    public function __construct() {
        global $logger;
        $this->logger = $logger;
    }

    public function login() {
        $this->DATA = getPostData();
        $this->checkDataValidity(["user", "password"]);

        if ($this->checkUser($this->DATA)) {
            setcookie("raspiControl_login",
                '{"user":"' .
                $this->DATA["user"] .
                '","password":"' .
                $this->DATA["password"] .
                '"}');

            echo json_encode(["status" => "true"]);
        } else {
            echo json_encode(["status" => "false", "msg" => "Username or password wrong!"]);
        }
    }

    public function register() {
        $users = $this->getUsers();
        $this->DATA = getPostData();
        $this->checkDataValidity(["user", "password"]);

        $this->checkUserExists($users);

        if (strlen($users[$this->DATA["user"]]) == 0) {
            $users[$this->DATA["user"]]["password"] = $this->DATA["password"];
            $this->setUsers($users);

            setcookie("raspiControl_login",
                '{"user":"' .
                $this->DATA["user"] .
                '","password":"' .
                $this->DATA["password"] .
                '"}');

            echo json_encode(["status" => "true"]);
        } else {
            echo json_encode(["status" => "false", "msg" => "User already exists!"]);
        }
    }

    public function removeUser() {
        $this->DATA = getPostData();
        $users = $this->getUsers();
        $this->checkDataValidity(["user"]);

        $this->checkUserExists($users);

        unset($users[$this->DATA["user"]]);
        $this->setUsers($users);

        echo json_encode(["status" => "true"]);
    }

    public function addUser() {
        $this->DATA = getPostData();
        $users = $this->getUsers();
        $this->checkDataValidity(["user", "privileges"]);

        $this->checkUserExists($users);

        $users[$this->DATA["user"]] = [
            "password" => "",
            "privileges" => $this->DATA["privileges"]
        ];
        $this->setUsers($users);

        echo json_encode(["status" => "true"]);
    }

    public function changePrivileges() {
        $this->DATA = getPostData();
        $this->checkDataValidity(["user", "privileges"]);

        $users = $this->getUsers();
        $this->checkUserExists($users);

        $users[$this->DATA["user"]]["privileges"] = $this->DATA["privileges"];
        $this->setUsers($users);

        echo json_encode(["status" => true, "msg" => "Operation Successful"]);
    }

    public function resetUser() {
        $this->DATA = getPostData();
        $this->checkDataValidity(["user"]);

        $users = $this->getUsers();

        if (isset($users[$this->DATA["user"]])) {
            $users[$this->DATA["user"]]["password"] = "";
            $this->setUsers($users);

            echo json_encode(["status" => "true"]);
        } else {
            echo json_encode(["status" => "false", "msg" => "User not found!"]);
        }
    }

    public function checkUser($DATA): bool {
        $this->DATA = $DATA;

        $users = $this->getUsers();
        if (!isset($users[$this->DATA["user"]])) {
            return false;
        }

        if ($users[$this->DATA["user"]]["password"] == $this->DATA["password"] && strlen($users[$this->DATA["user"]]["password"]) != 0) {
            return true;
        }
        return false;
    }

    public function getUsers() {
        if (is_file("/data/users.txt")) {
            $this->logger->error("User-File not found!");
            die();
        }

        $contents = file_get_contents(BASEPATH . "/data/users.txt");
        return json_decode($contents, true);
    }

    private function checkUserExists($users) {
        foreach (array_keys($users) as $username) {
            if ($username == $this->DATA["user"])
                return;
        }
        echo json_encode(["status" => false, "msg" => "User already exists!"]);
        die();
    }

    private function checkDataValidity($keys) {
        foreach ($keys as $key) {
            if (!isset($this->DATA[$key])) {
                echo json_encode(["status" => "false", "info" => $key . " not set in POST!"]);
                die();
            }
        }
    }

    private function setUsers($users) {
        if (is_file("/data/users.txt")) {
            $this->logger->error("User-File not found!");
            die();
        }

        file_put_contents(BASEPATH . "/data/users.txt", json_encode($users));
    }
}