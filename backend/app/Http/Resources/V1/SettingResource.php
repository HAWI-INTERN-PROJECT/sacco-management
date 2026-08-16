<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $sacco_id
 * @property-read string $loan_interest_rate
 * @property-read string $savings_interest_rate
 * @property-read string $dividend_rate
 * @property-read string $currency
 * @property-read \Carbon\Carbon|null $created_at
 * @property-read \Carbon\Carbon|null $updated_at
 * @property-read string $share_value
 */
class SettingResource extends JsonResource
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
            'loan_interest_rate' => (float) $this->loan_interest_rate,
            'savings_interest_rate' => (float) $this->savings_interest_rate,
            'dividend_rate' => (float) $this->dividend_rate,
            'share_value' => (float) $this->share_value,
            'currency' => $this->currency,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
