<?php

namespace Database\Factories;

use App\Models\Loan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Loan>
 */
class LoanFactory extends Factory
{
    protected $model = Loan::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sacco_id' => 1,
            'user_id' => User::factory(),
            'amount' => 1000.00,
            'purpose' => 'Business expansion',
            'status' => 'pending',
        ];
    }
}
