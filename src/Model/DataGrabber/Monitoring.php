<?php
if (!defined("BASEPATH")) die("No direct access allowed!");


class Monitoring {
    public static function getRPIData(): string {
        $DATA = getPostData();

        if (isset($DATA["view"])) {
            switch ($DATA["view"]) {
                case "hour":
                    return self::queryData("SELECT * FROM raspiHourView");
                case "day":
                    return self::queryData("SELECT * FROM raspiDayView");
                case "week":
                    return self::queryData("SELECT * FROM raspiWeekView");
                case "month":
                    return self::queryData("SELECT * FROM raspiMonthView");
                default:
                    return self::queryData("SELECT * FROM raspi_monitoring WHERE id == (SELECT max(id) FROM raspi_monitoring)");
            }
        } else {
            return json_encode(["status"=> false]);
        }
    }

    private static function queryData(string $query): string {
        $db = new SQLite3("data/sqdb.db");
        $db->busyTimeout(500);
        $result = $db->query($query);
        $data = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            array_push($data, $row);
        };
        $db->close();

        return json_encode($data);
    }
}