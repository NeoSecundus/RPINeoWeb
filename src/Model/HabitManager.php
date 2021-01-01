<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

class HabitManager {
    public static function checkRequest($url) {
        $DATA = getPostData();
        $USER = json_decode($_COOKIE["raspiControl_login"], true)["user"];

        switch (explode("/", $url)[2]) {
            case "addhabit":
                Logger::info("Requesting new Habit-Entry");
                # TODO
                break;
            case "deletehabit":
                Logger::info("Requesting to delete Habit-Entry");
                # TODO
                break;
            case "updatehabit":
                Logger::info("Requesting to update Habit-Entry");
                # TODO
                break;
            case "gethabits":
                Logger::info("Requesting to get Habits");
                # TODO
                break;
            case "addtrack":
                Logger::info("Requesting new Track Entry");
                # TODO
                break;
            case "deletetrack":
                Logger::info("Requesting to remove Track Entry");
                # TODO
                break;
            case "gettracks":
                Logger::info("Requesting to get Track Entries");
                # TODO
                break;
            default:
                Logger::warn("HabitManager: Unknown Request!");
                echo json_encode(["status" => false,"msg" => "Unknwon HabitManager command!"]);
        }
    }

    private static function addHabit($USER, $DATA) {
        if (!isset($DATA[""])) {
            return json_encode(["status" => false, "msg" => "Add Habit: Missing Data fields!"]);
        }
        
    }
}
