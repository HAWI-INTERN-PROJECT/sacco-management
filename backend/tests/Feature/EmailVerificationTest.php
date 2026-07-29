<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_verify_email(): void
    {
        $user = User::factory()->unverified()->create();

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->getEmailForVerification())]
        );

        $response = $this->get($url);

        $response->assertOk()
            ->assertJsonFragment(['message' => __('auth.email_verified')]);

        $this->assertTrue($user->fresh()->hasVerifiedEmail());
    }

    public function test_verify_email_with_invalid_hash_returns_403(): void
    {
        $user = User::factory()->unverified()->create();

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => 'invalid-hash']
        );

        $response = $this->get($url);

        $response->assertForbidden()
            ->assertJsonFragment(['message' => __('auth.invalid_verification_link')]);

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_verify_already_verified_email(): void
    {
        $user = User::factory()->create();

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->getEmailForVerification())]
        );

        $response = $this->get($url);

        $response->assertOk()
            ->assertJsonFragment(['message' => __('auth.email_already_verified')]);
    }

    public function test_authenticated_user_can_resend_verification_email(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/v1/email/resend');

        $response->assertOk()
            ->assertJsonFragment(['message' => __('auth.email_sent')]);
    }

    public function test_verified_user_cannot_resend_verification(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/v1/email/resend');

        $response->assertOk()
            ->assertJsonFragment(['message' => __('auth.email_already_verified')]);
    }

    public function test_unauthenticated_user_cannot_resend_verification(): void
    {
        $response = $this->postJson('/api/v1/email/resend');

        $response->assertUnauthorized();
    }
}
