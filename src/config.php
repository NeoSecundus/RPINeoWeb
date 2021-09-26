<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

 define('config', [
     'pagePrivileges' => [
        '/users.html' => 'Admin',
         '/monitoring.html' => 'Guest',
         '/404.html' => 'Guest',
         '/home.html' => 'Guest',
         '/denied.html' => 'Guest',
         '/notes.html' => 'Member',
         '/terminal.html' => 'Member',
         '/seafile.html' => 'Member',
         '/habits.html' => 'Member',
         '/napchart.html' => 'Guest',
         '/watersystem.html' => 'Admin',
         '/watersystem/add.phtml' => 'Admin',
         '/watersystem/control.phtml' => 'Admin',
         '/watersystem/monitoring.phtml' => 'Admin',
     ],
     'resourceTypes' => [
         // Images
         'png' => 'image/png',
         'jpg' => 'image/jpg',
         'ico' => 'image/x-icon',
         'svg' => 'image/svg+xml',

         // Scripts
         'css' => 'text/css',
         'js' => 'text/javascript'
     ],
     'themes' => [
         "default",
         "dark"
     ],
    'logfile' => BASEPATH . '/log/server.log',
    'loglevel' => 1 //Error: 0, Warn: 1, Info: 2, Fine: 3
 ]);