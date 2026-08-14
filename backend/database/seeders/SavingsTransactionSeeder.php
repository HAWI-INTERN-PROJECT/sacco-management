<?php

namespace Database\Seeders;

use App\Models\SavingsTransaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class SavingsTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $member = User::where('username', 'member')->first();

        SavingsTransaction::create([
            'user_id' => $member->id,
            'type' => 'credit',
            'amount' => 500.00,
            'balance_after' => 500.00,
            'description' => 'Initial deposit',
        ]);

        SavingsTransaction::create([
            'user_id' => $member->id,
            'type' => 'debit',
            'amount' => 200.00,
            'balance_after' => 300.00,
            'description' => 'Withdrawal for emergency',
        ]);
    }
}
