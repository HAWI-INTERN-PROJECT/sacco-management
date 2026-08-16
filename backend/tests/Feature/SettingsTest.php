<?php

namespace Tests\Feature;

use App\Models\Sacco;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    private Sacco $sacco;

    private Sacco $otherSacco;

    private User $admin;

    private User $otherAdmin;

    private User $member;

    protected function setUp(): void
    {
        parent::setUp();

        $this->sacco = Sacco::create(['name' => 'Sacco A', 'registration_number' => 'REG-A', 'status' => 'approved']);
        $this->otherSacco = Sacco::create(['name' => 'Sacco B', 'registration_number' => 'REG-B', 'status' => 'approved']);

        $this->admin = User::factory()->create(['role' => 'admin', 'sacco_id' => $this->sacco->id]);
        $this->otherAdmin = User::factory()->create(['role' => 'admin', 'sacco_id' => $this->otherSacco->id]);
        $this->member = User::factory()->create(['role' => 'member', 'sacco_id' => $this->sacco->id]);
    }

    public function test_unauthenticated_user_cannot_view_settings(): void
    {
        $this->getJson('/api/v1/settings')->assertStatus(401);
    }

    public function test_member_cannot_view_settings(): void
    {
        $this->actingAs($this->member)->getJson('/api/v1/settings')->assertStatus(403);
    }

    public function test_admin_gets_default_settings_created_on_first_access(): void
    {
        $this->assertDatabaseMissing('settings', ['sacco_id' => $this->sacco->id]);

        $response = $this->actingAs($this->admin)->getJson('/api/v1/settings');

        $response->assertStatus(200)
            ->assertJsonPath('data.sacco_id', $this->sacco->id)
            ->assertJsonPath('data.currency', 'KES');

        $this->assertDatabaseHas('settings', ['sacco_id' => $this->sacco->id]);
    }

    public function test_admin_can_update_settings(): void
    {
        $response = $this->actingAs($this->admin)->putJson('/api/v1/settings', [
            'loan_interest_rate' => 12.5,
            'dividend_rate' => 8,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.loan_interest_rate', 12.5)
            ->assertJsonPath('data.dividend_rate', 8);

        $this->assertDatabaseHas('settings', [
            'sacco_id' => $this->sacco->id,
            'dividend_rate' => 8,
        ]);
    }

    public function test_admin_cannot_see_another_saccos_settings(): void
    {
        Setting::create([
            'sacco_id' => $this->otherSacco->id,
            'dividend_rate' => 99,
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/v1/settings');

        $response->assertStatus(200)
            ->assertJsonPath('data.sacco_id', $this->sacco->id)
            ->assertJsonMissing(['dividend_rate' => 99]);
    }

    public function test_update_validates_rate_bounds(): void
    {
        $response = $this->actingAs($this->admin)->putJson('/api/v1/settings', [
            'dividend_rate' => 150,
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['dividend_rate']);
    }
}
