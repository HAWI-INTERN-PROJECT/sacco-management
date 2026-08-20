<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AdminSaccoController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\DividendController;
use App\Http\Controllers\Api\V1\LoanController;
use App\Http\Controllers\Api\V1\MemberController;
use App\Http\Controllers\Api\V1\MemberSavingsController;
use App\Http\Controllers\Api\V1\MemberShareController;
use App\Http\Controllers\Api\V1\RepaymentController;
use App\Http\Controllers\Api\V1\SaccoRegistrationController;
use App\Http\Controllers\Api\V1\SaccoSettingsController;
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
    // Member viewing their own savings
    Route::get('me/savings', [MemberSavingsController::class, 'showOwn'])
        ->name('api.v1.me.savings.show');
    // Member savings diposit
    Route::post('members/{id}/savings/deposit', [MemberSavingsController::class, 'deposit'])
        ->name('api.v1.members.savings.deposit');
    // Member savings withdrawal
    Route::post('members/{id}/savings/withdraw', [MemberSavingsController::class, 'withdraw'])
        ->name('api.v1.members.savings.withdraw');

    // Change password
    Route::put('change-password', [AuthController::class, 'changePassword'])->name('api.v1.change-password');

    Route::post('email/resend', [AuthController::class, 'resendVerificationEmail'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Member dividends history
    Route::get('me/dividends', [DividendController::class, 'memberHistory'])->name('api.v1.me.dividends');
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
        Route::get('dashboard/stats', [AdminSaccoController::class, 'stats'])->name('api.v1.admin.dashboard.stats');
        Route::get('saccos/export', [AdminSaccoController::class, 'export'])->name('api.v1.admin.saccos.export');
        Route::get('saccos', [AdminSaccoController::class, 'index'])->name('api.v1.admin.saccos.index');
        Route::get('saccos/{sacco}', [AdminSaccoController::class, 'show'])->name('api.v1.admin.saccos.show');
        Route::get('saccos/{sacco}/details', [AdminSaccoController::class, 'details'])->name('api.v1.admin.saccos.details');
        Route::patch('saccos/{sacco}/approve', [AdminSaccoController::class, 'approve'])->name('api.v1.admin.saccos.approve');
        Route::patch('saccos/{sacco}/reject', [AdminSaccoController::class, 'reject'])->name('api.v1.admin.saccos.reject');
    });

// ─── SACCO Admin Routes ──────────────────────────────────────────────
// Protected by auth + role:admin middleware
Route::middleware(['auth:sanctum', 'throttle:authenticated', 'role:admin'])
    ->group(function (): void {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('api.v1.dashboard');
        Route::get('dashboard/metrics', [DashboardController::class, 'metrics'])->name('api.v1.dashboard.metrics');
        Route::get('dashboard/charts', [DashboardController::class, 'charts'])->name('api.v1.dashboard.charts');
        Route::get('dashboard/activity', [DashboardController::class, 'activity'])->name('api.v1.dashboard.activity');

        Route::apiResource('members', MemberController::class)->names('api.v1.members');

        Route::post('dividends/calculate', [DividendController::class, 'calculate'])->name('api.v1.dividends.calculate');
        Route::post('dividends/distribute', [DividendController::class, 'distribute'])->name('api.v1.dividends.distribute');
        Route::get('dividends', [DividendController::class, 'adminHistory'])->name('api.v1.dividends.index');

        Route::get('settings', [SaccoSettingsController::class, 'show'])->name('api.v1.settings.show');
        Route::put('settings', [SaccoSettingsController::class, 'update'])->name('api.v1.settings.update');

        Route::get('shares/summary', [MemberShareController::class, 'summary'])->name('api.v1.shares.summary');
        Route::patch('members/{member}/shares', [MemberShareController::class, 'update'])->name('api.v1.members.shares.update');

        Route::post('repayments', [RepaymentController::class, 'store'])->name('api.v1.repayments.store');
        Route::get('repayments/overdue', [RepaymentController::class, 'overdue'])->name('api.v1.repayments.overdue');
    });

// ─── Loan Endpoints ──────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'throttle:authenticated', 'role:admin,sacco_admin'])->group(function (): void {
    Route::get('loans', [LoanController::class, 'index'])->name('api.v1.loans.index');
    Route::patch('loans/{loan}/approve', [LoanController::class, 'approve'])->name('api.v1.loans.approve');
    Route::patch('loans/{loan}/reject', [LoanController::class, 'reject'])->name('api.v1.loans.reject');
    Route::patch('loans/{loan}/disburse', [LoanController::class, 'disburse'])->name('api.v1.loans.disburse');
    Route::post('loans/{loan}/repayments', [RepaymentController::class, 'store'])->name('api.v1.loans.repayments.store');
    Route::get('repayments/overdue', [RepaymentController::class, 'overdue'])->name('api.v1.repayments.overdue');
});

Route::middleware(['auth:sanctum', 'throttle:authenticated', 'role:member'])->group(function (): void {
    Route::post('loans', [LoanController::class, 'store'])->name('api.v1.loans.store');
    Route::get('me/loans', [LoanController::class, 'myLoans'])->name('api.v1.me.loans');
});

Route::middleware(['auth:sanctum', 'throttle:authenticated'])->group(function (): void {
    Route::get('loans/{loan}', [LoanController::class, 'show'])->name('api.v1.loans.show');
    Route::get('loans/{loan}/repayments', [RepaymentController::class, 'index'])->name('api.v1.loans.repayments.index');
});
