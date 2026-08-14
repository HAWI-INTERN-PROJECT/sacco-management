<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AdminSaccoController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\MemberController;
use App\Http\Controllers\Api\V1\MemberSavingsController;
use App\Http\Controllers\Api\V1\SaccoRegistrationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API V1 Routes
|--------------------------------------------------------------------------
|
| Routes for API version 1.
|
*/

// Health check
Route::get('health', fn () => response()->json([
    'status' => 'healthy',
    'timestamp' => now()->toDateTimeString(),
]))->name('api.v1.health');

// Public routes with auth rate limiter (5/min - brute force protection)
Route::middleware('throttle:auth')->group(function (): void {
    Route::post('register', [AuthController::class, 'register'])->name('api.v1.register');
    Route::post('login', [AuthController::class, 'login'])->name('api.v1.login');
    Route::post('saccos/register', [SaccoRegistrationController::class, 'register'])->name('api.v1.saccos.register');
});

// Email verification
Route::get('email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware('signed')
    ->name('verification.verify');

// Protected routes with authenticated rate limiter (120/min)
Route::middleware(['auth:sanctum', 'throttle:authenticated'])->group(function (): void {
    Route::post('logout', [AuthController::class, 'logout'])->name('api.v1.logout');
    Route::get('profile', [AuthController::class, 'profile'])->name('api.v1.profile');
    // Member savings
    Route::get('members/{member}/savings', [MemberSavingsController::class, 'show'])
        ->name('api.v1.members.savings.show');

    // Change password
    Route::put('change-password', [AuthController::class, 'changePassword'])->name('api.v1.change-password');

    Route::post('email/resend', [AuthController::class, 'resendVerificationEmail'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});

// Password reset routes (public with rate limiting)
Route::middleware('throttle:6,1')->group(function (): void {
    Route::post('forgot-password', [AuthController::class, 'forgotPassword'])
        ->name('password.email');
    Route::post('reset-password', [AuthController::class, 'resetPassword'])
        ->name('password.reset');
});

// ─── Superadmin Routes ───────────────────────────────────────────────
// Protected by auth + role:superadmin middleware
Route::middleware(['auth:sanctum', 'throttle:authenticated', 'role:superadmin'])
    ->prefix('admin')
    ->group(function (): void {
        Route::get('saccos', [AdminSaccoController::class, 'index'])->name('api.v1.admin.saccos.index');
        Route::get('saccos/{sacco}', [AdminSaccoController::class, 'show'])->name('api.v1.admin.saccos.show');
        Route::patch('saccos/{sacco}/approve', [AdminSaccoController::class, 'approve'])->name('api.v1.admin.saccos.approve');
        Route::patch('saccos/{sacco}/reject', [AdminSaccoController::class, 'reject'])->name('api.v1.admin.saccos.reject');
    });

// ─── SACCO Admin Routes ──────────────────────────────────────────────
// Protected by auth + role:admin middleware
Route::middleware(['auth:sanctum', 'throttle:authenticated', 'role:admin'])
    ->group(function (): void {
        Route::apiResource('members', MemberController::class)->names('api.v1.members');
    });
