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
            case "deletegroup":
                Logger::info("Requesting to delete Group");
                return self::deleteGroup($DATA, $USER);
                break;
            case "updategroup":
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

        return DBHelper::sendDBRequest("SELECT * FROM raspi_notes 
WHERE group_title == ? and \"user\" == '$USER'",
            [$DATA['group']]);
    }


    private static function addNote($DATA, $USER): string {
        if (!isset($DATA["group"]) or
            !isset($DATA["title"]) or
            !isset($DATA["text"]) or
            !isset($DATA["create_date"])) {
            return json_encode(["status" => false, "msg" => "Note-Data missing!"]);
        }

        return DBHelper::sendDBRequest("INSERT INTO raspi_notes 
VALUES('$DATA[title]', 
'$USER', 
'$DATA[group]', 
'$DATA[text]', 
$DATA[create_date])", [], false);
    }


    private static function deleteNote($DATA, $USER): string {
        if (!isset($DATA["group"]) or !isset($DATA["title"])) {
            return json_encode(["status" => false, "msg" => "Group or title not set!"]);
        }

        return DBHelper::sendDBRequest("DELETE FROM raspi_notes 
WHERE title == ? and \"user\" == '$USER' and group_title == ?",
            [$DATA["title"], $DATA["group"]]);
    }


    private static function updateNote($DATA, $USER): string {
        if (!isset($DATA["group"]) or !isset($DATA["title"])) {
            return json_encode(["status" => false, "msg" => "Group or title not set!"]);
        }

        $res = '{"status":"false", "msg":"Notes: Nothing to update!"}';

        if (isset($DATA["new_text"])) {
            $res = DBHelper::sendDBRequest("UPDATE raspi_notes SET \"text\" = ? 
            WHERE title == ? and \"user\" == '$USER' and group_title == ?",
                [$DATA['new_text'], $DATA['title'], $DATA['group']]);
        }
        if (isset($DATA["new_title"])) {
            $res = DBHelper::sendDBRequest("UPDATE raspi_notes SET title = ?
WHERE title == ? and \"user\" == '$USER' and group_title == ?",
                [$DATA['new_title'], $DATA["title"], $DATA["group"]]);
        }
        return $res;
    }


    private static function addGroup($DATA, $USER): string {
        if (!isset($DATA["title"]) or !isset($DATA["color"])) {
            return json_encode(["status" => false, "msg" => "Title or color not set!"]);
        }

        return DBHelper::sendDBRequest("INSERT INTO raspi_note_groups 
VALUES('$DATA[title]', '$USER', '$DATA[color]')", [], false);
    }


    private static function deleteGroup($DATA, $USER): string {
        if (!isset($DATA["title"])) {
            return json_encode(["status" => false, "msg" => "Title not set!"]);
        }

        return DBHelper::sendDBRequest("DELETE FROM raspi_note_groups 
WHERE \"user\" == '$USER' and title == ?",
            [$DATA["title"]]);
    }


    private static function getGroups($DATA, $USER): string {
        return DBHelper::sendDBRequest("SELECT * FROM raspi_note_group_view 
WHERE \"user\" == '$USER'");
    }


    private static function updateGroup($DATA, $USER): string {
        if (!isset($DATA["title"])) {
            return json_encode(["status" => false, "msg" => "Group not set!"]);
        }

        $res = '{"status":"false", "msg":"Note-Groups: Nothing to update!"}';

        if (isset($DATA["new_color"])) {
            $res = DBHelper::sendDBRequest("UPDATE raspi_note_groups SET color = ? 
            WHERE title == ? and \"user\" == '$USER'",
                [$DATA["new_color"], $DATA["title"]]);
        }
        if (isset($DATA["new_title"])) {
            $res = DBHelper::sendDBRequest("UPDATE raspi_note_groups SET title = ? 
WHERE title == ? and \"user\" == '$USER'",
                [$DATA["new_title"], $DATA["title"]]);
        }
        return $res;
    }
}