<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

class Logger {

    public function error($msg) {
        $this->writeLog(" ERROR ---\n" .
            $msg . "\n" .
            "--- ERROR ---");
    }

    public function warn($msg) {
        if (config['loglevel'] < 1)
            return;

        $this->writeLog('[[WARN]]> ' . $msg);
    }

    public function info($msg) {
        if (config['loglevel'] < 2)
            return;

        $this->writeLog('[INFO]> ' . $msg);
    }

    public function fine($msg) {
        if (config['loglevel'] < 3)
            return;

        $this->writeLog('[FINE]> ' . $msg);
    }

    private function writeLog($msg) {
        $msg = date('d/m H:i:s ---') . $msg . "\n";

        $this->writeToFile($msg);
        $this->writeToConsole($msg);
    }

    private function writeToFile($msg) {
        $logFile = fopen(config['logfile'], 'a') or $this->writeToConsole("Write to file Failed!");
        fwrite($logFile, $msg);
        fclose($logFile);
    }

    private function writeToConsole($msg) {
        $output = $msg;
        if ( is_array( $output ) )
            $output = implode( ',', $output);

        echo '<script>console.log( "' . $output . '" );</script>';
    }
}