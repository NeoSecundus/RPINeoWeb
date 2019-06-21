<?php
if (!defined("BASEPATH")) die("No direct access allowed!");


class Monitoring {
    public static function getRaspiData(int $timestamp): string {
        $db = new SQLite3("/data/sqdb.db");
        $data = $db->query("SELECT * FROM raspi_monitoring WHERE id < " . $timestamp);
        $db->close();

        $data = $data->fetchArray();
        return json_encode($data);
    }
}