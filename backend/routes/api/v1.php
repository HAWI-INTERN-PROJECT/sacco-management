<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DividendController;
use App\Http\Controllers\Api\V1\MemberController;
use App\Http\Controllers\Api\V1\RepaymentController;
use App\Http\Controllers\Api\V1\SettingsController;
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
// Settings, member share management, and dividend calculation/distribution
// are restricted to the SACCO's own admin.
Route::middleware(['auth:sanctum', 'throttle:authenticated', 'role:admin'])
    ->group(function (): void {
        Route::get('settings', [SettingsController::class, 'show'])->name('api.v1.settings.show');
        Route::put('settings', [SettingsController::class, 'update'])->name('api.v1.settings.update');

        Route::patch('members/{id}/shares', [MemberController::class, 'updateShares'])->name('api.v1.members.shares.update');

        Route::post('dividends/calculate', [DividendController::class, 'calculate'])->name('api.v1.dividends.calculate');
        Route::post('dividends/distribute', [DividendController::class, 'distribute'])->name('api.v1.dividends.distribute');

        Route::post('loans/{loan}/repayments', [RepaymentController::class, 'store'])->name('api.v1.loans.repayments.store');
    });

// ─── Shared Authenticated Routes ─────────────────────────────────────
// Accessible by both SACCO admins and members; each controller scopes
// the data to the caller's own SACCO (and, for members, their own records).
Route::middleware(['auth:sanctum', 'throttle:authenticated'])
    ->group(function (): void {
        Route::get('me/dividends', [DividendController::class, 'myDividends'])->name('api.v1.me.dividends');

        Route::get('loans/{loan}/repayments', [RepaymentController::class, 'index'])->name('api.v1.loans.repayments.index');
        Route::get('repayments/overdue', [RepaymentController::class, 'overdue'])->name('api.v1.repayments.overdue');
    });

