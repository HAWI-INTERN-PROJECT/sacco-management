<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\CalculateDividendRequest;
use App\Http\Resources\V1\DividendResource;
use App\Http\Traits\ApiResponse;
use App\Models\Dividend;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DividendController extends Controller
{
    use ApiResponse;

    /**
     * Calculate dividend distribution preview without saving records.
     *
     * @param  CalculateDividendRequest  $request
     * @return JsonResponse
     */
    public function calculate(CalculateDividendRequest $request): JsonResponse
    {
        $admin = $request->user();
        $period = $request->validated('period');
        $totalPool = (float) $request->validated('total_pool');

        $members = User::where('sacco_id', $admin->sacco_id)
            ->where('role', 'member')
            ->get();

        $totalShares = (int) $members->sum('num_shares');

        $preview = $members->map(function ($member) use ($totalShares, $totalPool) {
            $shares = (int) ($member->num_shares ?? 0);
            $sharePct = $totalShares > 0 ? round(($shares / $totalShares) * 100, 2) : 0.0;
            $amount = $totalShares > 0 ? round(($totalPool * $shares) / $totalShares, 2) : 0.0;

            return [
                'member_id' => $member->id,
                'name' => $member->name,
                'shares' => $shares,
                'share_pct' => $sharePct,
                'amount' => $amount,
            ];
        })->values();

        return $this->success([
            'preview' => $preview,
            'total_pool' => $totalPool,
            'total_shares' => $totalShares,
        ], 'Dividend preview calculated successfully.');
    }

    /**
     * Calculate and save dividend distribution.
     *
     * @param  CalculateDividendRequest  $request
     * @return JsonResponse
     */
    public function distribute(CalculateDividendRequest $request): JsonResponse
    {
        $admin = $request->user();
        $saccoId = $admin->sacco_id;
        $period = $request->validated('period');
        $totalPool = (float) $request->validated('total_pool');

        // Prevent duplicate distributions for the same SACCO + period
        if (Dividend::where('sacco_id', $saccoId)->where('period', $period)->exists()) {
            return $this->error("Dividends for period '{$period}' have already been distributed.", 422);
        }

        $members = User::where('sacco_id', $saccoId)
            ->where('role', 'member')
            ->get();

        $totalShares = (int) $members->sum('num_shares');

        $dividendList = [];

        DB::transaction(function () use ($members, $totalShares, $totalPool, $period, $saccoId, &$dividendList) {
            foreach ($members as $member) {
                $shares = (int) ($member->num_shares ?? 0);
                $sharePct = $totalShares > 0 ? round(($shares / $totalShares) * 100, 4) : 0.0;
                $amount = $totalShares > 0 ? round(($totalPool * $shares) / $totalShares, 2) : 0.0;

                Dividend::create([
                    'sacco_id' => $saccoId,
                    'user_id' => $member->id,
                    'period' => $period,
                    'num_shares' => $shares,
                    'share_pct' => $sharePct,
                    'amount' => $amount,
                    'total_pool' => $totalPool,
                ]);

                $dividendList[] = [
                    'member_id' => $member->id,
                    'amount' => $amount,
                ];
            }
        });

        return $this->success([
            'dividends' => $dividendList,
            'count' => count($dividendList),
        ], 'Dividends distributed successfully.');
    }

    /**
     * Get dividend history for the SACCO admin.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function adminHistory(Request $request): JsonResponse
    {
        $admin = $request->user();

        $history = DB::table('dividends')
            ->where('sacco_id', $admin->sacco_id)
            ->select('period', 'total_pool', DB::raw('MIN(created_at) as distribution_date'), DB::raw('COUNT(user_id) as member_count'))
            ->groupBy('period', 'total_pool')
            ->orderByDesc('distribution_date')
            ->get()
            ->map(function (mixed $item) {
                return [
                    'period' => $item->period,
                    'distribution_date' => \Carbon\Carbon::parse($item->distribution_date)->toDateString(),
                    'total_pool' => round((float)$item->total_pool, 2),
                    'member_count' => $item->member_count,
                    'status' => 'completed',
                ];
            });

        return $this->success(
            $history,
            'Dividend history retrieved successfully.'
        );
    }

    /**
     * Get dividend history for the authenticated member.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function memberHistory(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->isMember()) {
            return $this->forbidden('Only members can access dividend history.');
        }

        $dividends = Dividend::where('user_id', $user->id)
            ->latest()
            ->get();

        return $this->success(
            DividendResource::collection($dividends),
            'Dividend history retrieved successfully.'
        );
    }
}
