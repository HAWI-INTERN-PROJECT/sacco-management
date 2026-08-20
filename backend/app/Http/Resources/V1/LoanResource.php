<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $sacco_id
 * @property-read int $user_id
 * @property-read float $amount
 * @property-read string $purpose
 * @property-read string $status
 * @property-read float|null $interest_rate
 * @property-read int|null $term_months
 * @property-read float|null $total_repayable
 * @property-read float|null $monthly_installment
 * @property-read string|null $rejection_reason
 * @property-read \Carbon\Carbon|null $approved_at
 * @property-read \Carbon\Carbon|null $disbursed_at
 * @property-read \Carbon\Carbon|null $created_at
 * @property-read \Carbon\Carbon|null $updated_at
 * @property-read mixed $user
 * @property-read mixed $schedules
 * @property-read mixed $repayments
 */
class LoanResource extends JsonResource
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
            'loan_number' => $this->loan_number,
            'sacco_id' => $this->sacco_id,
            'user_id' => $this->user_id,
            'amount' => (float) $this->amount,
            'purpose' => $this->purpose,
            'status' => $this->status,
            'interest_rate' => $this->interest_rate !== null ? (float) $this->interest_rate : null,
            'term_months' => $this->term_months,
            'total_repayable' => $this->total_repayable !== null ? (float) $this->total_repayable : null,
            'monthly_installment' => $this->monthly_installment !== null ? (float) $this->monthly_installment : null,
            'rejection_reason' => $this->rejection_reason,
            'approved_at' => $this->approved_at?->toDateTimeString(),
            'disbursed_at' => $this->disbursed_at?->toDateTimeString(),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'user' => UserResource::make($this->whenLoaded('user')),
            'repayment_schedule' => LoanScheduleResource::collection($this->whenLoaded('schedules')),
            'repayments' => RepaymentResource::collection($this->whenLoaded('repayments')),
        ];
    }
}
