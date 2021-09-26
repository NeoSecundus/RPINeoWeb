<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

class WaterSystem {
    public static function checkRequest($url) {
        $command = explode("/", $url)[2];
        $DATA = getPostData();

        switch($command) {
            case "addpump":
                Logger::info("Requesting to add new Pump!");
                return self::addPump($DATA);
                break;
            case "getpumps":
                Logger::info("Requesting to get pumps!");
                return self::getPumps();
                break;
            case "getpumpbyhost":
                Logger::info("Getting pump by host!");
                return self::getPumpByHost($DATA);
                break;
            case "updatepump":
                Logger::info("Updating pump...");
                return self::updatePump($DATA);
                break;
            case "getwsdata":
                Logger::info("Getting humidity-data!");
                return self::getHumData($DATA);
                break;
            default:
                Logger::warn("Unknwon command url!");
                return json_encode(["status" => false, "msg" => "Unknown request url!"]);
        }
    }

    private static function addPump($DATA) {
        if (!DBHelper::checkDataFields($DATA, ["id", "host", "port"])) {
            return DBHelper::createStatusJson(false, "Data entries missing!");
        }

        try {
            DBHelper::sendDBRequest("INSERT INTO pump VALUES(?,?,?,?,?,?,?,?,?)", 
                [$DATA["id"], $DATA["host"], $DATA["port"], 0.01, 0.0, false, "stopped", 10, 5], false);
        } catch (Exception $e) {
            return DBHelper::createStatusJson(false, "Constraint or connection error!");
        }
        return DBHelper::createStatusJson(true, "Pump added!");
    }

    private static function getPumps() {
        return DBHelper::sendDBRequest("SELECT * FROM pump;");
    }

    private static function getPumpByHost($DATA) {
        if (!DBHelper::checkDataFields($DATA, ["host"])) {
            return DBHelper::createStatusJson(false, "Missing data entry!");
        }

        return DBHelper::sendDBRequest("SELECT * FROM pump WHERE host LIKE ?;", [$DATA["host"]]);
    }

    private static function updatePump($DATA) {
        if (!DBHelper::checkDataFields($DATA, ["host", "port", "high_thresh", "low_thresh", "watering_time", "watering_delay"])) {
            return DBHelper::createStatusJson(false, "Missing data entry!");
        }
        $url = "http://" . $DATA["host"] . ":" . $DATA["port"] . "/set/";
        
        $fields = json_encode([
            "lowThresh" => $DATA["low_thresh"], 
            "highThresh" => $DATA["high_thresh"]
        ]);
        if (self::sendPost($url . "humidity-threshold", $fields) != 200) {
            return DBHelper::createStatusJson(false, "Pump Error! Could not set Thresholds!");
        }

        $fields = json_encode([
            "delay" => $DATA["watering_delay"]
        ]);
        if (self::sendPost($url . "watering-delay", $fields) != 200) {
            return DBHelper::createStatusJson(false, "Pump Error! Could not set watering delay!");
        }

        $fields = json_encode([
            "duration" => $DATA["watering_time"]
        ]);
        if (self::sendPost($url . "watering-duration", $fields) != 200) {
            return DBHelper::createStatusJson(false, "Pump Error! Could not set watering time!");
        }

        return DBHelper::createStatusJson(true, "");
    }

    private static function sendPost($url, $fields) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        $rescode = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
        return $rescode;
    }

    private static function getHumData($DATA) {
        if (!DBHelper::checkDataFields($DATA, ["timespan"])) {
            return DBHelper::createStatusJson(false, "Missing data field!");
        }

        switch ($DATA["timespan"]) {
            case "month":
                $limit = 2592000;
                break;
            case "year":
                $limit = 31556926;
                break;
            default:
                $limit = 86400;
        }

        return DBHelper::sendDBRequest("SELECT * FROM wsData WHERE date > strftime('%s', 'now')-$limit AND date < strftime('%s', 'now')-1800;");
    }
}