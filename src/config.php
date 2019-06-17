<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

 define('config', [
     'pagePrivileges' => [
        '/users.html' => 'Admin',
         '/monitoring.html' => 'Member',
         '/404.html' => 'Guest',
         '/home.html' => 'Guest',
         '/denied.html' => 'Guest'
     ],
     'resourceTypes' => [
         // Images
         'png' => 'image/png',
         'jpg' => 'image/jpg',
         'ico' => 'image/x-icon',
         'svg' => 'image/svg+xml',

         // Others
         'css' => 'text/css',
         'js' => 'text/js'
     ],
    'logfile' => BASEPATH . '/log/server.log',
    'loglevel' => 1 //Error: 0, Warn: 1, Info: 2, Fine: 3
 ]);