<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\RecordRepaymentRequest;
use App\Http\Traits\ApiResponse;
use App\Models\LoanSchedule;
use App\Models\Repayment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RepaymentController extends Controller
{
    use ApiResponse;

    public function overdue(Request $request): JsonResponse
    {
        $saccoId = $request->user()->sacco_id;

        $overdueInstallments = LoanSchedule::with(['loan.user'])
            ->whereHas('loan', function ($q) use ($saccoId) {
                $q->where('sacco_id', $saccoId);
            })
            ->where('due_date', '<', now()->toDateString())
            ->where('status', '!=', 'paid')
            ->orderBy('due_date', 'asc')
            ->get()
            ->map(function ($schedule) {
                $daysOverdue = now()->diffInDays($schedule->due_date);
                return [
                    'id' => $schedule->id,
                    'loan_id' => $schedule->loan_id,
                    'installment_number' => $schedule->installment_number,
                    'member_name' => $schedule->loan->user->name,
                    'due_date' => $schedule->due_date->toDateString(),
                    'days_overdue' => $daysOverdue,
                    'amount_due' => round($schedule->amount_due - $schedule->paid_amount, 2),
                ];
            });

        return $this->success([
            'count' => $overdueInstallments->count(),
            'total_amount' => $overdueInstallments->sum('amount_due'),
            'installments' => $overdueInstallments,
        ], 'Overdue installments retrieved successfully.');
    }

    public function store(RecordRepaymentRequest $request): JsonResponse
    {
        $admin = $request->user();
        
        $schedule = LoanSchedule::with('loan')->findOrFail($request->loan_schedule_id);

        if ($schedule->loan->sacco_id !== $admin->sacco_id) {
            return $this->forbidden('You do not have permission to modify this loan.');
        }

        if ($schedule->status === 'paid') {
            return $this->error('This installment is already fully paid.', 422);
        }

        $amountToPay = (float) $request->amount;
        $remainingDue = (float) ($schedule->amount_due - $schedule->paid_amount);

        if ($amountToPay > $remainingDue) {
            return $this->error('Payment amount exceeds remaining due for this installment.', 422);
        }

        DB::transaction(function () use ($request, $schedule, $amountToPay) {
            // Create Repayment record
            Repayment::create([
                'loan_id' => $schedule->loan_id,
                'user_id' => $schedule->loan->user_id,
                'loan_schedule_id' => $schedule->id,
                'amount' => $amountToPay,
                'payment_date' => $request->payment_date,
                'notes' => $request->notes,
            ]);

            // Update Schedule
            $newPaidAmount = $schedule->paid_amount + $amountToPay;
            $newStatus = abs($newPaidAmount - $schedule->amount_due) < 0.01 ? 'paid' : 'partial';

            $schedule->update([
                'paid_amount' => $newPaidAmount,
                'status' => $newStatus,
            ]);

            // Check if all installments are paid to close the loan
            $unpaidCount = $schedule->loan->schedules()->where('status', '!=', 'paid')->count();
            if ($unpaidCount === 0) {
                $schedule->loan->update(['status' => 'closed']);
            }
        });

        return $this->success(null, 'Repayment recorded successfully.');
    }
}
