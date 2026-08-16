<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

/**
 * A SACCO Member.
 *
 * There is no dedicated `members` table: a member is simply a `User`
 * with role='member'. This class exists so member-specific code can
 * refer to a clearly named model, while the underlying storage (and
 * all of User's auth behaviour) is reused as-is.
 */
class Member extends User
{
    /**
     * The table associated with the model.
     *
     * Member extends User but does not have its own migration/table —
     * without this, Eloquent derives the table name from the "Member"
     * class name itself (giving "members", which does not exist)
     * instead of inheriting "users" from the parent model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * Boot the model and scope all queries to role='member'.
     */
    protected static function booted(): void
    {
        static::addGlobalScope('member', function (Builder $builder) {
            $builder->where('role', 'member');
        });

        static::creating(function (User $user) {
            $user->role = 'member';
        });
    }
}
