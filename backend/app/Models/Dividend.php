<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dividend extends Model
{

    protected $fillable = [
        'sacco_id',
        'user_id',
        'period',
        'num_shares',
        'share_pct',
        'amount',
        'total_pool',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'num_shares' => 'integer',
            'share_pct' => 'float',
            'amount' => 'float',
            'total_pool' => 'float',
        ];
    }

    /**
     * Get the SACCO that owns the dividend.
     *
     * @return BelongsTo<Sacco, $this>
     */
    public function sacco(): BelongsTo
    {
        return $this->belongsTo(Sacco::class);
    }

    /**
     * Get the member user that owns the dividend.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
