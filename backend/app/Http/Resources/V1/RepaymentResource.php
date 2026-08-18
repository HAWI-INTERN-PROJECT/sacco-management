<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $loan_id
 * @property-read int $user_id
 * @property-read float $amount
 * @property-read \Carbon\Carbon $payment_date
 * @property-read string|null $notes
 * @property-read \Carbon\Carbon|null $created_at
 * @property-read \Carbon\Carbon|null $updated_at
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
            'user_id' => $this->user_id,
            'amount' => (float) $this->amount,
            'payment_date' => $this->payment_date->toDateString(),
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
