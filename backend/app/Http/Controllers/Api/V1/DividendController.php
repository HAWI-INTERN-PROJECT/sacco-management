<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\CalculateDividendRequest;
use App\Http\Requests\V1\DistributeDividendRequest;
use App\Http\Resources\V1\DividendResource;
use App\Http\Traits\ApiResponse;
use App\Models\Dividend;
use App\Models\Member;
use App\Models\Setting;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DividendController extends Controller
{
    use ApiResponse;

    /**
     * Calculate dividends for every member of the admin's SACCO for a period.
     *
     * Each member's dividend is their current share balance multiplied by
     * the rate (either an explicit override or the SACCO's configured
     * dividend_rate). Existing "distributed" records for the period are
     * left untouched; only "calculated" (or missing) records are written,
     * so recalculating never overwrites a payout that already went out.
     *
     * @param CalculateDividendRequest $request
     * @return JsonResponse
     */
    public function calculate(CalculateDividendRequest $request): JsonResponse
    {
        $saccoId = $request->user()->sacco_id;
        $period = $request->validated('period');
        $rate = $request->validated('rate');

        $setting = Setting::firstOrCreate(['sacco_id' => $saccoId]);

        if ($rate === null) {
            $rate = (float) $setting->dividend_rate;
        }

        $shareValue = (float) $setting->share_value;

        $dividends = DB::transaction(function () use (
        $saccoId,
        $period,
        $rate,
        $shareValue,
        $request
        ) {
            $members = Member::where('sacco_id', $saccoId)->get();
            $records = [];

            foreach ($members as $member) {
                $existing = Dividend::where('sacco_id', $saccoId)
                    ->where('member_id', $member->id)
                    ->where('period', $period)
                    ->first();

                // A dividend that has already been paid out is never recalculated.
                if ($existing && $existing->status === 'distributed') {
                    $records[] = $existing;

                    continue;
                }

                $shareCapital = bcmul(
                    (string) $member->shares,
                    (string) $shareValue,
                    2
                );

                $amount = bcmul(
                    $shareCapital,
                    bcdiv((string) $rate, '100', 6),
                    2
                );

                $records[] = Dividend::updateOrCreate(
                    ['sacco_id' => $saccoId, 'member_id' => $member->id, 'period' => $period],
                    [
                        'shares_at_calculation' => $member->shares,
                        'rate' => $rate,
                        'amount' => $amount,
                        'status' => 'calculated',
                        'calculated_at' => now(),
                        'calculated_by' => $request->user()->id,
                    ]
                );
            }

            return $records;
        });

        ActivityLogger::dividendsCalculated($request, [
            'sacco_id' => $saccoId,
            'period' => $period,
            'rate' => $rate,
            'members_count' => count($dividends),
        ]);

        return $this->success(
            DividendResource::collection(collect($dividends)),
            'Dividends calculated successfully.'
        );
    }

    /**
     * Distribute previously calculated dividends for a period.
     *
     * @param DistributeDividendRequest $request
     * @return JsonResponse
     */
    public function distribute(DistributeDividendRequest $request): JsonResponse
    {
        $saccoId = $request->user()->sacco_id;
        $period = $request->validated('period');

        $query = Dividend::where('sacco_id', $saccoId)
            ->where('period', $period)
            ->where('status', 'calculated');

        $count = $query->count();

        if ($count === 0) {
            return $this->error(
                'No calculated dividends found for this period. Run the calculation first.',
                422
            );
        }

        $query->update([
            'status' => 'distributed',
            'distributed_at' => now(),
            'distributed_by' => $request->user()->id,
        ]);

        ActivityLogger::dividendsDistributed($request, [
            'sacco_id' => $saccoId,
            'period' => $period,
            'members_count' => $count,
        ]);

        $dividends = Dividend::where('sacco_id', $saccoId)
            ->where('period', $period)
            ->where('status', 'distributed')
            ->get();

        return $this->success(
            DividendResource::collection($dividends),
            'Dividends distributed successfully.'
        );
    }

    /**
     * List the authenticated member's own dividend records.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function myDividends(Request $request): JsonResponse
    {
        $dividends = Dividend::where('member_id', $request->user()->id)
            ->latest('calculated_at')
            ->get();

        return $this->success(DividendResource::collection($dividends));
    }
}
