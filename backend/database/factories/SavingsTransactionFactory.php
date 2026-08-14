<?php

namespace Database\Factories;

use App\Models\SavingsTransaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SavingsTransaction>
 */
class SavingsTransactionFactory extends Factory
{
    protected $model = SavingsTransaction::class;

    /**
     * Define the factory's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['credit', 'debit']),
            'amount' => fake()->randomFloat(2, 1, 1000),
            'balance_after' => null,
            'description' => fake()->sentence(),
            'created_at' => now(),
        ];
    }
}
