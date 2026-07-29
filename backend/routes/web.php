<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        config('app.name'),
    ]);
});

// Log Viewer - Access at /logs
// Route is auto-registered by opcodesio/log-viewer
// To protect with auth, add middleware in config/log-viewer.php
