<?php

namespace Tests\Feature;

use App\Models\SavingsTransaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MemberSavingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_sacco_admin_can_view_member_savings(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $member = User::factory()->create();

        $this->assertInstanceOf(User::class, $admin);
        $this->assertInstanceOf(User::class, $member);

        SavingsTransaction::create([
            'user_id' => $member->id,
            'type' => 'credit',
            'amount' => 100.00,
            'balance_after' => 100.00,
            'description' => 'Initial deposit',
        ]);

        $response = $this->actingAs($admin)
            ->getJson("/api/v1/members/{$member->id}/savings");

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'balance',
                    'transactions' => [
                        ['id', 'type', 'amount', 'balance_after', 'description', 'date'],
                    ],
                ],
            ]);
    }
}
