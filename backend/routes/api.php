<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'throttle:authenticated', 'role:admin'])->group(function (): void {
    Route::get('settings', [\App\Http\Controllers\Api\V1\SaccoSettingsController::class, 'show'])->name('api.settings.show');
    Route::put('settings', [\App\Http\Controllers\Api\V1\SaccoSettingsController::class, 'update'])->name('api.settings.update');
    Route::patch('members/{member}/shares', [\App\Http\Controllers\Api\V1\MemberShareController::class, 'update'])->name('api.members.shares.update');
});
