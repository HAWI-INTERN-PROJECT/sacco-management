<?php

namespace Tests\Feature;

use App\Models\Sacco;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MemberSharesTest extends TestCase
{
    use RefreshDatabase;

    private Sacco $sacco;

    private Sacco $otherSacco;

    private User $admin;

    private User $member;

    private User $otherSaccoMember;

    protected function setUp(): void
    {
        parent::setUp();

        $this->sacco = Sacco::create(['name' => 'Sacco A', 'registration_number' => 'REG-A', 'status' => 'approved']);
        $this->otherSacco = Sacco::create(['name' => 'Sacco B', 'registration_number' => 'REG-B', 'status' => 'approved']);

        $this->admin = User::factory()->create(['role' => 'admin', 'sacco_id' => $this->sacco->id]);
        $this->member = User::factory()->create(['role' => 'member', 'sacco_id' => $this->sacco->id, 'shares' => 100]);
        $this->otherSaccoMember = User::factory()->create(['role' => 'member', 'sacco_id' => $this->otherSacco->id, 'shares' => 50]);
    }

    public function test_unauthenticated_user_cannot_update_shares(): void
    {
        $this->patchJson("/api/v1/members/{$this->member->id}/shares", ['shares' => 200])
            ->assertStatus(401);
    }

    public function test_member_cannot_update_shares(): void
    {
        $this->actingAs($this->member)
            ->patchJson("/api/v1/members/{$this->member->id}/shares", ['shares' => 200])
            ->assertStatus(403);
    }

    public function test_admin_can_update_own_members_shares(): void
    {
        $response = $this->actingAs($this->admin)
            ->patchJson("/api/v1/members/{$this->member->id}/shares", ['shares' => 250.50]);

        $response->assertStatus(200)
            ->assertJsonPath('data.shares', 250.5);

        $this->assertDatabaseHas('users', [
            'id' => $this->member->id,
            'shares' => 250.50,
        ]);
    }

    public function test_admin_cannot_update_shares_for_member_in_another_sacco(): void
    {
        $response = $this->actingAs($this->admin)
            ->patchJson("/api/v1/members/{$this->otherSaccoMember->id}/shares", ['shares' => 999]);

        $response->assertStatus(404);

        $this->assertDatabaseHas('users', [
            'id' => $this->otherSaccoMember->id,
            'shares' => 50,
        ]);
    }

    public function test_shares_must_be_non_negative_number(): void
    {
        $this->actingAs($this->admin)
            ->patchJson("/api/v1/members/{$this->member->id}/shares", ['shares' => -10])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['shares']);
    }

    public function test_admin_cannot_update_shares_for_non_member_user(): void
    {
        $adminUser = User::factory()->create(['role' => 'admin', 'sacco_id' => $this->sacco->id]);

        $this->actingAs($this->admin)
            ->patchJson("/api/v1/members/{$adminUser->id}/shares", ['shares' => 100])
            ->assertStatus(404);
    }
}
