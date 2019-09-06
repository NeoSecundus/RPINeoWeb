<?php
if (!defined("BASEPATH")) die("No direct access allowed!");


class Monitoring {
    public static function getRPIData(): string {
        $DATA = getPostData();

        if (isset($DATA["view"])) {
            switch ($DATA["view"]) {
                case "hour":
                    return self::queryData("SELECT * FROM raspiHourView", 2);
                case "day":
                    return self::queryData("SELECT * FROM raspiDayView", 60);
                case "month":
                    return self::queryData("SELECT * FROM raspiMonthView", 1440);
                default:
                    return self::queryData("SELECT * FROM raspi_monitoring WHERE id == (SELECT max(id) FROM raspi_monitoring)", 0);
            }
        } else {
            return json_encode(["status"=> false]);
        }
    }

    private static function queryData(string $query, int $averageIterator): string {
        $db = new SQLite3("data/sqdb.db");
        $db->busyTimeout(500);
        $result = $db->query($query);
        $data = [];

        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            array_push($data, $row);
        };
        $db->close();

        if ($averageIterator > 1) {
            $avgData = [];
            $iterations = floor(count($data)/$averageIterator);
            $dataPos = 0;

            for ($i = 0; $i < $iterations; $i++) {
                $collector = $data[$dataPos];

                for ($ai = 1; $ai < $averageIterator; $ai++) {
                    $dataPos++;
                    foreach (array_keys($collector) as $key) {
                        $collector[$key] += $data[$dataPos][$key];
                    }
                }
                $dataPos++;

                foreach (array_keys($collector) as $key) {
                    $collector[$key] /= $averageIterator;
                }
                array_push($avgData, $collector);
            }

            return json_encode($avgData);
        } else {
            return json_encode($data);
        }
    }
}