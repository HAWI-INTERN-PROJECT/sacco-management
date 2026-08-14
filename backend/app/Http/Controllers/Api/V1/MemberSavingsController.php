<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Members\ShowSavingsRequest;
use App\Http\Resources\V1\MemberSavingsResource;
use App\Http\Traits\ApiResponse;
use App\Models\SavingsTransaction;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

class MemberSavingsController extends Controller
{
    use ApiResponse;

    public function show(ShowSavingsRequest $request, User $member): MemberSavingsResource|JsonResponse
    {
        $payload = $this->buildSavingsPayload($member);

        ActivityLogger::log('view_savings', "Viewed savings for member {$member->id}", $request, ['member_id' => $member->id]);

        return MemberSavingsResource::make($payload)->additional([]);
    }

    protected function buildSavingsPayload(User $member): object
    {
        $transactions = SavingsTransaction::where('user_id', $member->id)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        return (object) [
            'balance' => $this->calculateBalance($member->id, $transactions),
            'transactions' => $transactions,
        ];
    }

    /**
     * Calculate member balance from transactions.
     *
     * @param  int  $memberId
     * @param  Collection<int, SavingsTransaction>|null  $transactions
     * @return float
     */
    protected function calculateBalance(int $memberId, ?Collection $transactions = null): float
    {
        $transactions = $transactions ?? SavingsTransaction::where('user_id', $memberId)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        $latest = $transactions->first();

        if ($latest && $latest->balance_after !== null) {
            return (float) $latest->balance_after;
        }

        $credits = (float) $transactions->where('type', 'credit')->sum('amount');
        $debits = (float) $transactions->where('type', 'debit')->sum('amount');

        return round($credits - $debits, 2);
    }
}
