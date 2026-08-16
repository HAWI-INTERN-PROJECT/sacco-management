<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $sacco_id
 * @property-read int $loan_id
 * @property-read int|null $loan_schedule_id
 * @property-read string $amount
 * @property-read string|null $method
 * @property-read \Carbon\Carbon $paid_at
 */
class RepaymentResource extends JsonResource
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
            'loan_id' => $this->loan_id,
            'loan_schedule_id' => $this->loan_schedule_id,
            'amount' => (float) $this->amount,
            'method' => $this->method,
            'paid_at' => $this->paid_at?->toDateTimeString(),
            'recorded_by' => $this->recorded_by,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
