<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Models\SavingsTransaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponse;

    /**
     * Get dashboard statistics for the authenticated admin's SACCO.
     */
    public function index(Request $request): JsonResponse
    {
        $saccoId = $request->user()->sacco_id;

        // Total members in this SACCO.
        $totalMembers = User::where('sacco_id', $saccoId)
            ->where('role', 'member')
            ->count();

        // Total savings deposits minus withdrawals.
        $totalDeposits = SavingsTransaction::whereHas('user', function ($query) use ($saccoId): void {
            $query->where('sacco_id', $saccoId);
        })
            ->where('type', 'deposit')
            ->sum('amount');

        $totalWithdrawals = SavingsTransaction::whereHas('user', function ($query) use ($saccoId): void {
            $query->where('sacco_id', $saccoId);
        })
            ->where('type', 'withdraw')
            ->sum('amount');

        $totalSavings = $totalDeposits - $totalWithdrawals;

        // Active loans belonging to this SACCO.
        $activeLoans = Loan::where('sacco_id', $saccoId)
            ->where('status', 'active')
            ->count();

        // Outstanding balance from active loans.
        $outstandingBalance = Loan::where('sacco_id', $saccoId)
            ->where('status', 'active')
            ->sum('total_repayable');

        // Number of overdue loan schedules.
        $overdueCount = LoanSchedule::whereHas('loan', function ($query) use ($saccoId): void {
            $query->where('sacco_id', $saccoId);
        })
            ->where('status', 'overdue')
            ->count();

        // Total share capital.
        $totalShares = User::where('sacco_id', $saccoId)
            ->where('role', 'member')
            ->sum('num_shares');

        $shareValue = $request->user()->sacco->share_value ?? 0;

        $totalShareCapital = $totalShares * $shareValue;

        return $this->success(
            [
                'total_members' => $totalMembers,
                'total_savings' => $totalSavings,
                'active_loans' => $activeLoans,
                'outstanding_balance' => $outstandingBalance,
                'overdue_count' => $overdueCount,
                'total_share_capital' => $totalShareCapital,
            ],
            'Dashboard statistics retrieved successfully.'
        );
    }
}