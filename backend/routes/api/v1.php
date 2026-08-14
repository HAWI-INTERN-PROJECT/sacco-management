<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\LoanController;
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
    Route::post('saccos/register', [\App\Http\Controllers\Api\V1\SaccoRegistrationController::class, 'register'])->name('api.v1.saccos.register');
});

// Email verification
Route::get('email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware('signed')
    ->name('verification.verify');

// Protected routes with authenticated rate limiter (120/min)
Route::middleware(['auth:sanctum', 'throttle:authenticated'])->group(function (): void {
    Route::post('logout', [AuthController::class, 'logout'])->name('api.v1.logout');
    Route::get('profile', [AuthController::class, 'profile'])->name('api.v1.profile');

    // Change password
    Route::put('change-password', [AuthController::class, 'changePassword'])->name('api.v1.change-password');

    Route::post('email/resend', [AuthController::class, 'resendVerificationEmail'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Member dividends history
    Route::get('me/dividends', [\App\Http\Controllers\Api\V1\DividendController::class, 'memberHistory'])->name('api.v1.me.dividends');
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
        Route::get('saccos', [\App\Http\Controllers\Api\V1\AdminSaccoController::class, 'index'])->name('api.v1.admin.saccos.index');
        Route::get('saccos/{sacco}', [\App\Http\Controllers\Api\V1\AdminSaccoController::class, 'show'])->name('api.v1.admin.saccos.show');
        Route::patch('saccos/{sacco}/approve', [\App\Http\Controllers\Api\V1\AdminSaccoController::class, 'approve'])->name('api.v1.admin.saccos.approve');
        Route::patch('saccos/{sacco}/reject', [\App\Http\Controllers\Api\V1\AdminSaccoController::class, 'reject'])->name('api.v1.admin.saccos.reject');
    });

// ─── SACCO Admin Routes ──────────────────────────────────────────────
// Protected by auth + role:admin middleware
Route::middleware(['auth:sanctum', 'throttle:authenticated', 'role:admin'])
    ->group(function (): void {
        Route::post('dividends/calculate', [\App\Http\Controllers\Api\V1\DividendController::class, 'calculate'])->name('api.v1.dividends.calculate');
        Route::post('dividends/distribute', [\App\Http\Controllers\Api\V1\DividendController::class, 'distribute'])->name('api.v1.dividends.distribute');
        Route::get('settings', [\App\Http\Controllers\Api\V1\SaccoSettingsController::class, 'show'])->name('api.v1.settings.show');
        Route::put('settings', [\App\Http\Controllers\Api\V1\SaccoSettingsController::class, 'update'])->name('api.v1.settings.update');
        Route::patch('members/{member}/shares', [\App\Http\Controllers\Api\V1\MemberShareController::class, 'update'])->name('api.v1.members.shares.update');
        Route::apiResource('members', \App\Http\Controllers\Api\V1\MemberController::class)->names('api.v1.members');
    });

// ─── Loan Endpoints ──────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'throttle:authenticated', 'role:admin,sacco_admin'])->group(function (): void {
    Route::get('loans', [LoanController::class, 'index'])->name('api.v1.loans.index');
    Route::patch('loans/{loan}/approve', [LoanController::class, 'approve'])->name('api.v1.loans.approve');
    Route::patch('loans/{loan}/reject', [LoanController::class, 'reject'])->name('api.v1.loans.reject');
    Route::patch('loans/{loan}/disburse', [LoanController::class, 'disburse'])->name('api.v1.loans.disburse');
});

Route::middleware(['auth:sanctum', 'throttle:authenticated', 'role:member'])->group(function (): void {
    Route::post('loans', [LoanController::class, 'store'])->name('api.v1.loans.store');
    Route::get('me/loans', [LoanController::class, 'myLoans'])->name('api.v1.me.loans');
});

Route::middleware(['auth:sanctum', 'throttle:authenticated'])->group(function (): void {
    Route::get('loans/{loan}', [LoanController::class, 'show'])->name('api.v1.loans.show');
});
