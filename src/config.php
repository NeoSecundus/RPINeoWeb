<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

 define('config', [
     'resourceTypes' => [
         // Images
         'png' => 'image/png',
         'jpg' => 'image/jpg',
         'ico' => 'image/x-icon',

         // Others
         'css' => 'text/css',
         'js' => 'text/js'
     ],
    'logfile' => BASEPATH . '/log/server.log',
    'loglevel' => 1 //Error: 0, Warn: 1, Info: 2, Fine: 3
 ]);