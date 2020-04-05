<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

if (!defined("INCLUDED")) {
    define("INCLUDED", null);
} else {
    die("ERROR: Files were already included! Include twice not allowed!");
}

includeAll(BASEPATH . "/src");
function includeAll($startDir) {
    foreach (glob($startDir . "/*", GLOB_ONLYDIR) as $lowerDir) {
        if (substr($lowerDir, strlen($lowerDir)-8) == "includes")
            continue;

        includeAll($lowerDir);
    }

    foreach (glob($startDir . "/*.php", GLOB_BRACE) as $phpFile) {
        if (is_file($phpFile)) {
            include_once($phpFile);
        }
    }
}