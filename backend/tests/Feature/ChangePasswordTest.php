<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ChangePasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_change_password(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('old-password'),
        ]);

        $response = $this->actingAs($user)
            ->putJson('/api/v1/change-password', [
                'current_password' => 'old-password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response->assertOk()
            ->assertJsonFragment(['message' => __('passwords.changed')]);

        // Verify new password works
        $this->assertTrue(
            Hash::check('new-password', $user->fresh()->password)
        );
    }

    public function test_change_password_requires_current_password(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->putJson('/api/v1/change-password', [
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['current_password']);
    }

    public function test_change_password_requires_new_password(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->putJson('/api/v1/change-password', [
                'current_password' => 'old-password',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    }

    public function test_change_password_requires_password_confirmation(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->putJson('/api/v1/change-password', [
                'current_password' => 'old-password',
                'password' => 'new-password',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    }

    public function test_change_password_fails_with_wrong_current_password(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('correct-password'),
        ]);

        $response = $this->actingAs($user)
            ->putJson('/api/v1/change-password', [
                'current_password' => 'wrong-password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['current_password']);
    }

    public function test_change_password_requires_min_8_characters(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('old-password'),
        ]);

        $response = $this->actingAs($user)
            ->putJson('/api/v1/change-password', [
                'current_password' => 'old-password',
                'password' => 'short',
                'password_confirmation' => 'short',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    }

    public function test_unauthenticated_user_cannot_change_password(): void
    {
        $response = $this->putJson('/api/v1/change-password', [
            'current_password' => 'old-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertUnauthorized();
    }
}
