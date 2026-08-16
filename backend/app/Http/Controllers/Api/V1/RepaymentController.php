<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreRepaymentRequest;
use App\Http\Resources\V1\LoanScheduleResource;
use App\Http\Resources\V1\RepaymentResource;
use App\Http\Traits\ApiResponse;
use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Models\Repayment;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RepaymentController extends Controller
{
    use ApiResponse;

    /**
     * Record a repayment against a loan.
     *
     * Only the SACCO admin who owns the loan may record repayments.
     * The amount is applied against outstanding installments in order
     * (earliest unpaid first); any excess rolls forward to the next
     * unpaid installment. The loan is marked "completed" once every
     * installment is fully paid.
     *
     * @param StoreRepaymentRequest $request
     * @param int $loan
     * @return JsonResponse
     */
    public function store(StoreRepaymentRequest $request, int $loan): JsonResponse
    {
        $user = $request->user();

        if (! $user->isAdmin()) {
            return $this->forbidden('Only SACCO admins can record repayments.');
        }

        $loanModel = Loan::where('sacco_id', $user->sacco_id)->find($loan);

        if (! $loanModel) {
            return $this->notFound('Loan not found.');
        }

        $amount = (string) $request->validated('amount');
        $paidAt = $request->validated('paid_at') ?? now();
        $method = $request->validated('method');

        $repayment = DB::transaction(function () use ($loanModel, $amount, $paidAt, $method, $user) {
            $repayment = Repayment::create([
                'sacco_id' => $loanModel->sacco_id,
                'loan_id' => $loanModel->id,
                'amount' => $amount,
                'paid_at' => $paidAt,
                'method' => $method,
                'recorded_by' => $user->id,
            ]);

            $remaining = $amount;
            $lastSchedule = null;

            $schedules = LoanSchedule::where('loan_id', $loanModel->id)
                ->where('status', '!=', 'paid')
                ->orderBy('installment_number')
                ->get();

            foreach ($schedules as $schedule) {
                if (bccomp($remaining, '0', 2) <= 0) {
                    break;
                }

                $outstanding = $schedule->outstandingBalance();
                $applied = bccomp($remaining, $outstanding, 2) >= 0 ? $outstanding : $remaining;

                $schedule->amount_paid = bcadd((string) $schedule->amount_paid, $applied, 2);
                $schedule->status = bccomp($schedule->amount_paid, (string) $schedule->total_due, 2) >= 0
                    ? 'paid'
                    : 'partial';
                $schedule->save();

                $remaining = bcsub($remaining, $applied, 2);
                $lastSchedule = $schedule;
            }

            if ($lastSchedule) {
                $repayment->update(['loan_schedule_id' => $lastSchedule->id]);
            }

            $stillOutstanding = LoanSchedule::where('loan_id', $loanModel->id)
                ->where('status', '!=', 'paid')
                ->exists();

            if (! $stillOutstanding) {
                $loanModel->update(['status' => 'completed']);
            }

            return $repayment;
        });

        ActivityLogger::repaymentRecorded($request, [
            'loan_id' => $loanModel->id,
            'amount' => $amount,
        ]);

        return $this->created(RepaymentResource::make($repayment), 'Repayment recorded successfully.');
    }

    /**
     * List repayments for a loan.
     *
     * Admins may view repayments for any loan in their own SACCO.
     * Members may only view repayments for their own loans.
     *
     * @param Request $request
     * @param int $loan
     * @return JsonResponse
     */
    public function index(Request $request, int $loan): JsonResponse
    {
        $user = $request->user();

        $loanQuery = Loan::where('sacco_id', $user->sacco_id)->where('id', $loan);

        if ($user->isMember()) {
            $loanQuery->where('member_id', $user->id);
        }

        $loanModel = $loanQuery->first();

        if (! $loanModel) {
            return $this->notFound('Loan not found.');
        }

        $repayments = Repayment::where('loan_id', $loanModel->id)
            ->latest('paid_at')
            ->get();

        return $this->success(RepaymentResource::collection($repayments));
    }

    /**
     * List overdue loan installments.
     *
     * Admins see every overdue installment across their SACCO's loans.
     * Members see only overdue installments on their own loans.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function overdue(Request $request): JsonResponse
    {
        $user = $request->user();

        // Lazily flip any installment that is now past its due date but
        // still recorded as pending/partial into "overdue".
        LoanSchedule::whereHas('loan', fn ($q) => $q->where('sacco_id', $user->sacco_id))
            ->whereIn('status', ['pending', 'partial'])
            ->where('due_date', '<', now()->toDateString())
            ->update(['status' => 'overdue']);

        $query = LoanSchedule::with('loan.member')
            ->whereHas('loan', function ($q) use ($user) {
                $q->where('sacco_id', $user->sacco_id);

                if ($user->isMember()) {
                    $q->where('member_id', $user->id);
                }
            })
            ->where('status', 'overdue')
            ->orderBy('due_date');

        return $this->success(LoanScheduleResource::collection($query->get()));
    }
}
