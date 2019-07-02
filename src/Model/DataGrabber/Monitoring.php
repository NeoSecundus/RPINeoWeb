<?php
if (!defined("BASEPATH")) die("No direct access allowed!");


class Monitoring {
    public static function getRPIData(): string {
        $DATA = getPostData();
        if (isset($DATA["timestamp"])) {
            $timestamp = $DATA["timestamp"];
            return self::queryData("SELECT * FROM raspi_monitoring WHERE id <= " . $timestamp . " LIMIT 30");
        } else {
            return self::queryData("SELECT * FROM raspi_monitoring WHERE id == (SELECT max(id) FROM raspi_monitoring)");
        }
    }

    private static function queryData(string $query): string {
        $db = new SQLite3("data/sqdb.db");
        $result = $db->query($query);
        $data = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            array_push($data, $row);
        };
        $db->close();

        return json_encode($data);
    }
}