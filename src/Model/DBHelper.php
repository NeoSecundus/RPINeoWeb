<?php

class DBHelper {
    public static function sendDBRequest($query, $data = [], $is_select = true): string {
        $db = new SQLite3("data/sqdb.db");
        $db->busyTimeout(500);
        $db->query("PRAGMA foreign_keys = ON;");
        $db->enableExceptions(true);
        $stmt = $db->prepare($query);
        for ($pos = 0; $pos < count($data); $pos++) {
            $stmt->bindParam($pos+1,$data[$pos]);
        }
        $result = $stmt->execute();
        $data = [];

        if ($is_select) {
            try {
                while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                    array_push($data, $row);
                };
            } catch (Exception $err) {
                Logger::error($err);
            }
        }
        $db->close();

        return json_encode($data);
    }

    public static function checkDataFields($DATA, $keys): bool {
        foreach ($keys as $key) {
            if (!isset($DATA[$key])) {
                return false;
            }
        }

        return true;
    }

    public static function createStatusJson($status, $msg): string {
        return json_encode(["status" => $status, "msg" => $msg]);
    }
}
