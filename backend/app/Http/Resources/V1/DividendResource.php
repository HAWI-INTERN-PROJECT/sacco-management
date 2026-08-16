<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $sacco_id
 * @property-read int $member_id
 * @property-read string $period
 * @property-read string $shares_at_calculation
 * @property-read string $rate
 * @property-read string $amount
 * @property-read string $status
 * @property-read \Carbon\Carbon|null $calculated_at
 * @property-read \Carbon\Carbon|null $distributed_at
 */
class DividendResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sacco_id' => $this->sacco_id,
            'member_id' => $this->member_id,
            'member' => $this->whenLoaded('member', fn () => [
                'id' => $this->member->id,
                'name' => $this->member->name,
            ]),
            'period' => $this->period,
            'shares_at_calculation' => (float) $this->shares_at_calculation,
            'rate' => (float) $this->rate,
            'amount' => (float) $this->amount,
            'status' => $this->status,
            'calculated_at' => $this->calculated_at?->toDateTimeString(),
            'distributed_at' => $this->distributed_at?->toDateTimeString(),
        ];
    }
}
