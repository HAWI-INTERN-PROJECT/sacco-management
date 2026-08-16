<?php

namespace Tests\Feature;

use App\Models\Sacco;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DividendTest extends TestCase
{
    use RefreshDatabase;

    private Sacco $sacco;

    private User $admin;

    private User $memberA;

    private User $memberB;

    protected function setUp(): void
    {
        parent::setUp();

        $this->sacco = Sacco::create(['name' => 'Sacco A', 'registration_number' => 'REG-A', 'status' => 'approved']);

        $this->admin = User::factory()->create(['role' => 'admin', 'sacco_id' => $this->sacco->id]);
        $this->memberA = User::factory()->create(['role' => 'member', 'sacco_id' => $this->sacco->id, 'shares' => 1000]);
        $this->memberB = User::factory()->create(['role' => 'member', 'sacco_id' => $this->sacco->id, 'shares' => 500]);

        Setting::create(['sacco_id' => $this->sacco->id, 'dividend_rate' => 10]);
    }

    public function test_member_cannot_calculate_dividends(): void
    {
        $this->actingAs($this->memberA)
            ->postJson('/api/v1/dividends/calculate', ['period' => '2026'])
            ->assertStatus(403);
    }

    public function test_admin_can_calculate_dividends_using_settings_rate(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/dividends/calculate', ['period' => '2026']);

        $response->assertStatus(200)->assertJsonCount(2, 'data');

        $this->assertDatabaseHas('dividends', [
            'sacco_id' => $this->sacco->id,
            'member_id' => $this->memberA->id,
            'period' => '2026',
            'amount' => 100.00,
            'status' => 'calculated',
        ]);

        $this->assertDatabaseHas('dividends', [
            'member_id' => $this->memberB->id,
            'amount' => 50.00,
        ]);
    }

    public function test_admin_can_override_rate_when_calculating(): void
    {
        $this->actingAs($this->admin)
            ->postJson('/api/v1/dividends/calculate', ['period' => '2026', 'rate' => 20])
            ->assertStatus(200);

        $this->assertDatabaseHas('dividends', [
            'member_id' => $this->memberA->id,
            'amount' => 200.00,
        ]);
    }

    public function test_distribute_requires_prior_calculation(): void
    {
        $this->actingAs($this->admin)
            ->postJson('/api/v1/dividends/distribute', ['period' => '2026'])
            ->assertStatus(422);
    }

    public function test_admin_can_distribute_calculated_dividends(): void
    {
        $this->actingAs($this->admin)->postJson('/api/v1/dividends/calculate', ['period' => '2026']);

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/dividends/distribute', ['period' => '2026']);

        $response->assertStatus(200)->assertJsonCount(2, 'data');

        $this->assertDatabaseHas('dividends', [
            'member_id' => $this->memberA->id,
            'status' => 'distributed',
        ]);
    }

    public function test_recalculating_does_not_overwrite_distributed_dividends(): void
    {
        $this->actingAs($this->admin)->postJson('/api/v1/dividends/calculate', ['period' => '2026']);
        $this->actingAs($this->admin)->postJson('/api/v1/dividends/distribute', ['period' => '2026']);

        // Member's shares change after distribution.
        $this->memberA->update(['shares' => 5000]);

        $this->actingAs($this->admin)->postJson('/api/v1/dividends/calculate', ['period' => '2026']);

        $this->assertDatabaseHas('dividends', [
            'member_id' => $this->memberA->id,
            'status' => 'distributed',
            'amount' => 100.00,
        ]);
    }

    public function test_member_sees_only_their_own_dividends(): void
    {
        $this->actingAs($this->admin)->postJson('/api/v1/dividends/calculate', ['period' => '2026']);

        $response = $this->actingAs($this->memberA)->getJson('/api/v1/me/dividends');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.member_id', $this->memberA->id);
    }
}
