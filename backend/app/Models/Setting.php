<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Setting extends Model
{
   protected $fillable = [
    'sacco_id',
    'loan_interest_rate',
    'savings_interest_rate',
    'dividend_rate',
    'share_value',
    'currency',
];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
{
    return [
        'loan_interest_rate' => 'decimal:2',
        'savings_interest_rate' => 'decimal:2',
        'dividend_rate' => 'decimal:2',
        'share_value' => 'decimal:2',
    ];
}
    protected static function booted(): void
    {
    static::creating(function (Setting $setting) {
        $setting->currency ??= 'KES';
    });
    }
    /**
     * @return BelongsTo<Sacco, $this>
     */
    public function sacco(): BelongsTo
    {
        return $this->belongsTo(Sacco::class);
    }
}
