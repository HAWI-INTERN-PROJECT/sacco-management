<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Log Viewer Route
    |--------------------------------------------------------------------------
    |
    | The route path where the log viewer will be accessible from.
    | You can change this to anything you like.
    |
    */

    'route_path' => 'logs',

    /*
    |--------------------------------------------------------------------------
    | Log Viewer Middleware
    |--------------------------------------------------------------------------
    |
    | The middleware used to protect the log viewer route.
    | You can add your own middleware here to restrict access.
    |
    */

    'middleware' => [],

    /*
    |--------------------------------------------------------------------------
    | Log Viewer Theme
    |--------------------------------------------------------------------------
    |
    | The theme to use for the log viewer.
    | Available: 'light', 'dark', 'auto'
    |
    */

    'theme' => 'auto',

    /*
    |--------------------------------------------------------------------------
    | Log Files Per Page
    |--------------------------------------------------------------------------
    |
    | The number of log entries to display per page.
    |
    */

    'per_page' => 25,

    /*
    |--------------------------------------------------------------------------
    | Log Viewer Date Format
    |--------------------------------------------------------------------------
    |
    | The date format used for log timestamps.
    |
    */

    'date_format' => 'Y-m-d H:i:s',

    /*
    |--------------------------------------------------------------------------
    | Scan Files In
    |--------------------------------------------------------------------------
    |
    | The directory where log files are stored.
    |
    */

    'scan_path' => storage_path('logs'),

    /*
    |--------------------------------------------------------------------------
    | File Pattern
    |--------------------------------------------------------------------------
    |
    | The pattern to match log files.
    |
    */

    'file_pattern' => '*.log',

];
