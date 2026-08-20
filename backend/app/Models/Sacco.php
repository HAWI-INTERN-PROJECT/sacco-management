<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sacco extends Model
{
    protected $fillable = [
        'name',
        'registration_number',
        'status',
        'rejection_reason',
        'share_value',
        'currency',
    ];

    /**
<<<<<<< HEAD
=======
     * @return HasMany<User, $this>
>>>>>>> 77b8048 (Add repayment API endpoints)
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'share_value' => 'decimal:2',
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