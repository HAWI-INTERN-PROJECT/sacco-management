<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $sacco_id
 * @property int $loan_id
 * @property int $loan_schedule_id
 * @property float $amount
 * @property \Carbon\Carbon $paid_at
 * @property string $method
 * @property int $recorded_by
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property-read \App\Models\Sacco $sacco
 * @property-read \App\Models\Loan $loan
 * @property-read \App\Models\LoanSchedule $loanSchedule
 * @property-read \App\Models\User $recordedByUser
 */
class Repayment extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'sacco_id',
        'loan_id',
        'loan_schedule_id',
        'amount',
        'paid_at',
        'method',
        'recorded_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'paid_at' => 'date',
            'amount' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<Sacco, $this>
     */
    public function sacco(): BelongsTo
    {
        return $this->belongsTo(Sacco::class);
    }

    /**
     * @return BelongsTo<Loan, $this>
     */
    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class);
    }

    /**
     * @return BelongsTo<LoanSchedule, $this>
     */
    public function loanSchedule(): BelongsTo
    {
        return $this->belongsTo(LoanSchedule::class, 'loan_schedule_id');
    }

    /**
     * The admin who recorded this repayment.
     *
     * @return BelongsTo<User, $this>
     */
    public function recordedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    /**
     * @return BelongsTo<LoanSchedule, $this>
     */
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(LoanSchedule::class, 'loan_schedule_id');
    }
}
