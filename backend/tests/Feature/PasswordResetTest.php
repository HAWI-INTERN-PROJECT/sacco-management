<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_request_password_reset(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/v1/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertOk()
            ->assertJsonFragment(['message' => __('passwords.sent')]);
    }

    public function test_forgot_password_with_invalid_email_returns_422(): void
    {
        $response = $this->postJson('/api/v1/forgot-password', [
            'email' => 'nonexistent@example.com',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_forgot_password_requires_email(): void
    {
        $response = $this->postJson('/api/v1/forgot-password', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_forgot_password_requires_valid_email(): void
    {
        $response = $this->postJson('/api/v1/forgot-password', [
            'email' => 'not-an-email',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_user_can_reset_password_with_valid_token(): void
    {
        $user = User::factory()->create();

        $token = Password::createToken($user);

        $response = $this->postJson('/api/v1/reset-password', [
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
            'token' => $token,
        ]);

        $response->assertOk()
            ->assertJsonFragment(['message' => __('passwords.reset')]);

        // Verify new password works
        $this->assertTrue(
            Hash::check('new-password', $user->fresh()->password)
        );
    }

    public function test_reset_password_with_invalid_token(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/v1/reset-password', [
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
            'token' => 'invalid-token',
        ]);

        $response->assertBadRequest()
            ->assertJsonFragment(['message' => __('passwords.token')]);
    }

    public function test_reset_password_requires_token(): void
    {
        $response = $this->postJson('/api/v1/reset-password', [
            'email' => 'test@example.com',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['token']);
    }

    public function test_reset_password_requires_email(): void
    {
        $response = $this->postJson('/api/v1/reset-password', [
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
            'token' => 'some-token',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_reset_password_requires_password(): void
    {
        $response = $this->postJson('/api/v1/reset-password', [
            'email' => 'test@example.com',
            'token' => 'some-token',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    }

    public function test_reset_password_revokes_all_tokens(): void
    {
        $user = User::factory()->create();
        $user->createToken('existing-token');

        $this->assertDatabaseCount('personal_access_tokens', 1);

        $token = Password::createToken($user);

        $this->postJson('/api/v1/reset-password', [
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
            'token' => $token,
        ]);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
