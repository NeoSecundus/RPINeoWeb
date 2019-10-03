<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

class NoteManager {
    public static function checkRequest($url) {
        $DATA = getPostData();
        $USER = json_decode($_COOKIE["raspiControl_login"], true)["user"];

        switch (explode("/", $url)[2]) {
            case "getnotes":
                Logger::info("Reqesting to get Notes");
                return self::getNotes($DATA, $USER);
                break;
            case "addnote":
                Logger::info("Requesting to add Note");
                return self::addNote($DATA, $USER);
                break;
            case "deletenote":
                Logger::info("Requesting to delete Note");
                return self::deleteNote($DATA, $USER);
                break;
            case "updatenote":
                Logger::info("Requesting to update Note");
                return self::updateNote($DATA, $USER);
                break;
            case "getgroups":
                Logger::info("Requesting to get Groups");
                return self::getGroups($DATA, $USER);
                break;
            case "addgroup":
                Logger::info("Requesting to add Group");
                return self::addGroup($DATA, $USER);
                break;
            case "deletegroups":
                Logger::info("Requesting to delete Group");
                return self::deleteGroup($DATA, $USER);
                break;
            case "updategroups":
                Logger::info("Requesting to update Group");
                return self::updateGroup($DATA, $USER);
                break;
            default:
                return json_encode(["status" => false, "msg" => "Unknown NoteManager command!"]);
        }
    }


    private static function getNotes($DATA, $USER): string {
        if (!isset($DATA["group"])) {
            return json_encode(["status" => false, "msg" => "Group not set!"]);
        }

        return self::sendDBRequest("SELECT * FROM raspi_notes 
WHERE group_title == '$DATA[group]' and 
\"user\" == '$USER'");
    }


    private static function addNote($DATA, $USER): string {
        if (!isset($DATA["group"]) or
            !isset($DATA["title"]) or
            !isset($DATA["text"]) or
            !isset($DATA["create_date"])) {
            return json_encode(["status" => false, "msg" => "Note-Data missing!"]);
        }

        return self::sendDBRequest("INSERT INTO raspi_notes 
VALUES('$DATA[title]', 
'$USER', 
'$DATA[group]', 
'$DATA[text]', 
$DATA[create_date])");
    }


    private static function deleteNote($DATA, $USER): string {
        if (!isset($DATA["group"]) or !isset($DATA["title"])) {
            return json_encode(["status" => false, "msg" => "Group or title not set!"]);
        }

        return self::sendDBRequest("DELETE FROM raspi_notes 
WHERE title == '$DATA[title]' and \"user\" == '$USER' and group_title == '$DATA[group]'");
    }


    private static function updateNote($DATA, $USER): string {
        if (!isset($DATA["group"]) or !isset($DATA["title"])) {
            return json_encode(["status" => false, "msg" => "Group or title not set!"]);
        }

        $res = '{"status":"false", "msg":"Notes: Nothing to update!"}';

        if (isset($DATA["new_title"])) {
            $res = self::sendDBRequest("UPDATE raspi_notes SET title = '$DATA[new_title]' 
WHERE title == '$DATA[title]' and \"user\" == '$USER' and group_title == '$DATA[group]'");
        }
        if (isset($DATA["new_text"])) {
            $res = self::sendDBRequest("UPDATE raspi_notes SET \"text\" = '$DATA[new_text]' 
            WHERE title == '$DATA[title]' and \"user\" == '$USER' and group_title == '$DATA[group]'");
        }
        return $res;
    }


    private static function addGroup($DATA, $USER): string {
        if (!isset($DATA["title"]) or !isset($DATA["color"])) {
            return json_encode(["status" => false, "msg" => "Title or color not set!"]);
        }

        return self::sendDBRequest("INSERT INTO raspi_note_groups 
VALUES('$DATA[title]', '$USER', '$DATA[color]')");
    }


    private static function deleteGroup($DATA, $USER): string {
        if (!isset($DATA["title"])) {
            return json_encode(["status" => false, "msg" => "Title not set!"]);
        }

        self::sendDBRequest("DELETE FROM raspi_notes WHERE group_title = '$DATA[title]'");
        return self::sendDBRequest("DELETE FROM raspi_note_groups 
WHERE \"user\" == '$USER' and title == '$DATA[title]'");
    }


    private static function getGroups($DATA, $USER): string {
        return self::sendDBRequest("SELECT * FROM raspi_note_group_view 
WHERE \"user\" == '$USER'");
    }


    private static function updateGroup($DATA, $USER): string {
        if (!isset($DATA["title"])) {
            return json_encode(["status" => false, "msg" => "Group not set!"]);
        }

        $res = '{"status":"false", "msg":"Note-Groups: Nothing to update!"}';

        if (isset($DATA["new_title"])) {
            $res = self::sendDBRequest("UPDATE raspi_note_groups SET title = '$DATA[new_title]' 
WHERE title == '$DATA[title]' and \"user\" == '$USER'");
        }
        if (isset($DATA["new_color"])) {
            $res = self::sendDBRequest("UPDATE raspi_note_groups SET color = '$DATA[new_color]' 
            WHERE title == '$DATA[title]' and \"user\" == '$USER'");
        }
        return $res;
    }

    private static function sendDBRequest($query): string {
        $db = new SQLite3("data/sqdb.db");
        $db->busyTimeout(500);
        $db->query("PRAGMA foreign_keys = ON;");
        $result = $db->query($query);
        $data = [];

        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            array_push($data, $row);
        };
        $db->close();

        return json_encode($data);
    }
}