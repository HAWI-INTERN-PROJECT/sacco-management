<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Sacco extends Model
{
    protected $fillable = [
        'name',
        'registration_number',
        'status',
        'share_value',
        'currency',
        'email',
        'phone',
        'address',
        'default_interest_rate',
        'max_loan_amount',
        'max_loan_term',
        'loan_to_savings_ratio',
        'min_shares_per_member',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'share_value' => 'decimal:2',
            'default_interest_rate' => 'decimal:2',
            'max_loan_amount' => 'decimal:2',
            'max_loan_term' => 'integer',
            'loan_to_savings_ratio' => 'decimal:2',
            'min_shares_per_member' => 'integer',
        ];
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\User, $this>
     */
    public function members(): HasMany
    {
        return $this->hasMany(User::class)->where('role', 'member');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough<\App\Models\SavingsTransaction, \App\Models\User, $this>
     */
    public function savingsTransactions(): HasManyThrough
    {
        return $this->hasManyThrough(SavingsTransaction::class, User::class, 'sacco_id', 'member_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\Loan, $this>
     */
    public function loans(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Loan::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\Dividend, $this>
     */
    public function dividends(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Dividend::class);
    }
}