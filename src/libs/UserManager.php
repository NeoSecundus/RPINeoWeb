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
        $this->checkDataValidity();

        if ($this->checkUser($this->DATA)) {
            setcookie("raspiControl_login",
                '{"user":"' .
                $this->DATA["user"] .
                '","pass":"' .
                $this->DATA["pass"] .
                '"}');

            echo json_encode(["status" => "true"]);
        } else {
            echo json_encode(["status" => "false", "msg" => "Username or password wrong!"]);
        }
    }

    public function register() {
        $users = $this->getUsers();
        $this->DATA = getPostData();
        $this->checkDataValidity();

        $this->checkUserExists($users);

        if (strlen($users[$this->DATA["user"]]) == 0) {
            $users[$this->DATA["user"]] = $this->DATA["pass"];
            $this->setUsers($users);

            setcookie("raspiControl_login",
                '{"user":"' .
                $this->DATA["user"] .
                '","pass":"' .
                $this->DATA["pass"] .
                '"}');

            echo json_encode(["status" => "true"]);
        } else {
            echo json_encode(["status" => "false", "msg" => "User already exists!"]);
        }
    }

    public function checkUser($DATA) {
        $this->DATA = $DATA;

        $users = $this->getUsers();
        if (!isset($users[$this->DATA["user"]])) {
            return false;
        }

        if ($users[$this->DATA["user"]] == $this->DATA["pass"] && strlen($users[$this->DATA["user"]]) != 0) {
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
        echo json_encode(["status" => "false", "msg" => "User does not exist! User must be pre-created by Admin!"]);
        die();
    }

    private function checkDataValidity() {
        if (!isset($this->DATA["user"]) || !isset($this->DATA["pass"])) {
            echo json_encode(["status" => "false", "info" => "User or Pass not set in POST!"]);
            die();
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