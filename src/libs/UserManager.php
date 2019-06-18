<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

class UserManager {
    private $DATA;

    public function login() {
        $this->DATA = getPostData();
        $this->checkDataValidity(["user", "password"]);

        $this->checkUserDoesExist();

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
        $users = UserManager::getUsers();
        $this->DATA = getPostData();
        $this->checkDataValidity(["user", "password"]);

        $this->checkUserDoesExist();

        if (strlen($users[$this->DATA["user"]]["password"]) == 0) {
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
        $users = UserManager::getUsers();
        $this->checkDataValidity(["user"]);

        $this->checkUserDoesExist();

        unset($users[$this->DATA["user"]]);
        $this->setUsers($users);

        echo json_encode(["status" => "true"]);
    }

    public function addUser() {
        $this->DATA = getPostData();
        $users = UserManager::getUsers();
        $this->checkDataValidity(["user", "privileges"]);

        if (isset($users[$this->DATA["user"]])) {
            echo json_encode(["status" => false, "msg" => "User already exists!"]);
            die();
        }

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

        $users = UserManager::getUsers();

        $this->checkUserDoesExist();

        $users[$this->DATA["user"]]["privileges"] = $this->DATA["privileges"];
        $this->setUsers($users);

        echo json_encode(["status" => "true"]);
    }

    public function resetUser() {
        $this->DATA = getPostData();
        $this->checkDataValidity(["user"]);

        $users = UserManager::getUsers();
        $this->checkUserDoesExist();

        $users[$this->DATA["user"]]["password"] = "";
        $this->setUsers($users);

        echo json_encode(["status" => "true"]);
    }

    public static function checkPrivileges(string $privilege, bool $operation = false) {
        $users = UserManager::getUsers();
        $curUser = json_decode($_COOKIE["raspiControl_login"], true);

        $necessary = UserManager::privilegesToInt($privilege);
        $userPrivilege = UserManager::privilegesToInt($users[$curUser["user"]]["privileges"]);

        $hasPrivileges = ($userPrivilege >= $necessary);

        if ($operation && !$hasPrivileges) {
            echo json_encode(["status" => "false", "msg" => "Not high enough rights!"]);
            die();
        }

        if (!$hasPrivileges) {
            $view = new MainView();
            $view->sendPage("/denied.html");
            die();
        }
    }

    private static function privilegesToInt(string $privilege): int {
        if ($privilege == "Admin") {
            return 2;
        } elseif ($privilege == "Member") {
            return 1;
        } else {
            return 0;
        }
    }

    public function checkUser($DATA): bool {
        $this->DATA = $DATA;

        $users = UserManager::getUsers();
        if (!isset($users[$this->DATA["user"]])) {
            return false;
        }

        if ($users[$this->DATA["user"]]["password"] == $this->DATA["password"] && strlen($users[$this->DATA["user"]]["password"]) != 0) {
            return true;
        }
        return false;
    }

    public static function getUsers() {
        if (!is_file(BASEPATH . "/data/users.ndb")) {
            Logger::error("User-File not found!");
            die();
        }

        $contents = file_get_contents(BASEPATH . "/data/users.ndb");
        return json_decode($contents, true);
    }

    private function checkUserDoesExist() {
        $users = UserManager::getUsers();

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
        if (!is_file(BASEPATH . "/data/users.ndb")) {
            Logger::error("User-File not found!");
            die();
        }

        file_put_contents(BASEPATH . "/data/users.ndb", json_encode($users));
    }
}