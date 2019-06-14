<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

class Logger {

    public static function error($msg) {
        Logger::writeLog("\n--- ERROR ---\n" .
            $msg . "\n" .
            "--- ERROR END ---");
    }

    public static function warn($msg) {
        if (config['loglevel'] < 1)
            return;

        Logger::writeLog("[[WARN]]> " . $msg);
    }

    public static function info($msg) {
        if (config['loglevel'] < 2)
            return;

        Logger::writeLog("[INFO]> " . $msg);
    }

    public static function fine($msg) {
        if (config['loglevel'] < 3)
            return;

        Logger::writeLog("[FINE]> " . $msg);
    }

    private static function writeLog($msg) {
        $msg = date('d/m H:i:s ') . $msg . "\n";

        Logger::writeToFile($msg);
        Logger::writeToConsole($msg);
    }

    private static function writeToFile($msg) {
        $logFile = fopen(config['logfile'], 'a') or Logger::writeToConsole("Write to file Failed!");
        fwrite($logFile, $msg);
        fclose($logFile);
    }

    private static function writeToConsole($msg) {
        $output = $msg;
        if ( is_array( $output ) )
            $output = implode( ',', $output);

        echo '<script>console.log( "' . $output . '" );</script>';
    }
}