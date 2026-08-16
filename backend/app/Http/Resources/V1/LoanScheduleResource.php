<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $loan_id
 * @property-read int $installment_number
 * @property-read \Carbon\Carbon $due_date
 * @property-read string $total_due
 * @property-read string $amount_paid
 * @property-read string $status
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
            'member' => $this->whenLoaded('loan', fn () => $this->loan->relationLoaded('member') ? [
                'id' => $this->loan->member->id,
                'name' => $this->loan->member->name,
            ] : null),
            'installment_number' => $this->installment_number,
            'due_date' => $this->due_date?->toDateString(),
            'principal_due' => (float) $this->principal_due,
            'interest_due' => (float) $this->interest_due,
            'total_due' => (float) $this->total_due,
            'amount_paid' => (float) $this->amount_paid,
            'outstanding_balance' => (float) $this->outstandingBalance(),
            'status' => $this->status,
        ];
    }
}
