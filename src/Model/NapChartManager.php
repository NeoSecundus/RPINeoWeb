<?php

class NapChartManager {
    public static function checkRequest($url) {
        $DATA = getPostData();
        $USER = json_decode($_COOKIE["raspiControl_login"], true)["user"];

        switch (explode("/", $url)[2]) {
            case "save":
                Logger::info("Saving NapChart");
                return self::saveChart($USER, $DATA);
                break;
            case "load":
                Logger::info("Loading NapChart");
                return self::loadChart($USER);
                break;
            default:
                return DBHelper::createStatusJson(false, "Unknown request url: " . $url);
        }
    }

    private static function saveChart($USER, $DATA): string {
        DBHelper::sendDBRequest("DELETE FROM nap_chart WHERE user LIKE ?;", 
            [$USER]);
        return DBHelper::sendDBRequest("INSERT INTO nap_chart VALUES(?, ?);", 
            [$USER, json_encode($DATA)]);
    }

    private static function loadChart($USER): string {
        return DBHelper::sendDBRequest("SELECT * FROM nap_chart WHERE user == ?;", 
            [$USER]);
    }
}