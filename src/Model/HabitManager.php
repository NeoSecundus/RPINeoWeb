<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

class HabitManager {
    public static function checkRequest($url): string {
        $DATA = getPostData();
        $USER = json_decode($_COOKIE["raspiControl_login"], true)["user"];

        switch (explode("/", $url)[2]) {
            case "addhabit":
                Logger::info("Requesting new Habit-Entry");
                return self::addHabit($USER, $DATA);
                break;
            case "deletehabit":
                Logger::info("Requesting to delete Habit-Entry");
                return self::deleteHabit($DATA);
                break;
            case "updatehabit":
                Logger::info("Requesting to update Habit-Entry");
                return self::updateHabit($DATA);
                break;
            case "gethabits":
                Logger::info("Requesting to get Habits");
                return self::getHabits($USER);
                break;
            case "addtrack":
                Logger::info("Requesting new Track Entry");
                return self::addTrack($DATA);
                break;
            case "deletetrack":
                Logger::info("Requesting to remove Track Entry");
                return self::deleteTrack($DATA);
                break;
            case "gettracks":
                Logger::info("Requesting to get Track Entries");
                return self::getTracks($DATA);
                break;
            default:
                Logger::warn("HabitManager: Unknown Request!");
                echo json_encode(["status" => false,"msg" => "Unknwon HabitManager command!"]);
        }
    }

    private static function addHabit($USER, $DATA): string {
        if (!DBHelper::checkDataFields($DATA, ["create_date", "title", "desc"])) {
            return DBHelper::createStatusJson(false, "Add Habit: Missing Data fields!");
        }
        
        return DBHelper::sendDBRequest("INSERT INTO habits VALUES(?, ?, ?, ?)", 
        [$DATA["create_date"], $USER, $DATA["title"], $DATA["desc"]]);
    }

    private static function deleteHabit($DATA): string {
        if (!isset($DATA["id"])) {
            return DBHelper::createStatusJson(false, "Delete Habit: Missing id in data!");
        }

        return DBHelper::sendDBRequest("DELETE FROM habits WHERE id == ?", 
        [$DATA["id"]]);
    }

    private static function updateHabit($DATA): string {
        if (!DBHelper::checkDataFields($DATA, ["id", "title", "desc"])) {
            return DBHelper::createStatusJson(false, "Update Habit: Missing Data fields");
        }

        return DBHelper::sendDBRequest("UPDATE habit SET title = ?, desc = ? WHERE id = ?", [$DATA["title"], $DATA["desc"], $DATA["id"]]);
    }

    private static function getHabits($USER): string {
        return DBHelper::sendDBRequest("SELECT * FROM habit WHERE user = ?", [$USER]);
    }

    private static function addTrack($DATA): string {
        if (!DBHelper::checkDataFields($DATA, ["habit_id", "date"])) {
            return DBHelper::createStatusJson(false, "Add Track: Missing Data fields");
        }

        return DBHelper::sendDBRequest("INSERT INTO habit_track VALUES(?, ?)", 
        [$DATA["habit_id"], $DATA["date"]]);
    }

    private static function deleteTrack($DATA): string {
        if (!DBHelper::checkDataFields($DATA, ["habit_id", "date"])) {
            return DBHelper::createStatusJson(false, "Delete Track: Missing Data fields");
        }

        return DBHelper::sendDBRequest("DELETE FROM habit_track WHERE habit = ? AND date = ?", 
        [$DATA["habit_id"], $DATA["date"]]);
    }

    private static function getTracks($DATA): string {
        if (!DBHelper::checkDataFields($DATA, ["habit_id"])) {
            return DBHelper::createStatusJson(false, "Get Tracks: Missing habit id");
        }

        return DBHelper::sendDBRequest("SELECT * FROM habit_track WHERE habit = ?", 
        [$DATA["habit_id"]]);
    }
}
