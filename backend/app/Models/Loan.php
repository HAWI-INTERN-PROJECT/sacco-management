<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $sacco_id
 * @property int $user_id
 * @property float $amount
 * @property string $purpose
 * @property string $status
 * @property float|null $interest_rate
 * @property int|null $term_months
 * @property float|null $total_repayable
 * @property float|null $monthly_installment
 * @property string|null $rejection_reason
 * @property \Carbon\Carbon|null $approved_at
 * @property \Carbon\Carbon|null $disbursed_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property-read \App\Models\Sacco $sacco
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\LoanSchedule> $schedules
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Repayment> $repayments
 */
class Loan extends Model
{
    /** @use HasFactory<\Database\Factories\LoanFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'sacco_id',
        'user_id',
        'amount',
        'purpose',
        'status',
        'interest_rate',
        'term_months',
        'total_repayable',
        'monthly_installment',
        'rejection_reason',
        'approved_at',
        'disbursed_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'interest_rate' => 'decimal:2',
            'total_repayable' => 'decimal:2',
            'monthly_installment' => 'decimal:2',
            'approved_at' => 'datetime',
            'disbursed_at' => 'datetime',
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
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<LoanSchedule, $this>
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(LoanSchedule::class);
    }

    /**
     * @return HasMany<Repayment, $this>
     */
    public function repayments(): HasMany
    {
        return $this->hasMany(Repayment::class);
    }
}
