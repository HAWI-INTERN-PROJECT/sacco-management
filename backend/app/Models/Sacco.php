<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sacco extends Model
{
    protected $fillable = [
        'name',
        'registration_number',
        'status',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\User, $this>
     */
    public function users(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\Dividend, $this>
     */
    public function dividends(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Dividend::class);
    }
}
