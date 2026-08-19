<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $loan_id
 * @property-read int $installment_number
 * @property-read \Carbon\Carbon $due_date
 * @property-read float $principal_due
 * @property-read float $interest_due
 * @property-read float $total_due
 * @property-read float $amount_paid
 * @property-read string $status
 * @property-read \Carbon\Carbon|null $created_at
 * @property-read \Carbon\Carbon|null $updated_at
 */
class LoanScheduleResource extends JsonResource
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
            'installment_number' => $this->installment_number,
            'due_date' => $this->due_date->toDateString(),
            'principal_due' => (float) $this->principal_due,
            'interest_due' => (float) $this->interest_due,
            'total_due' => (float) $this->total_due,
            'amount_paid' => (float) $this->amount_paid,
            'status' => $this->status,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
