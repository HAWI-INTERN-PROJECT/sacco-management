<?php

namespace Tests\Feature;

use App\Models\Invitation;
use App\Models\MembershipRequest;
use App\Models\Sacco;
use App\Models\User;
use App\Notifications\MembershipRequestApprovedNotification;
use App\Notifications\MembershipRequestRejectedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class MembershipRequestTest extends TestCase
{
    use RefreshDatabase;

    private Sacco $saccoA;

    private Sacco $saccoB;

    private User $adminA;

    private User $adminB;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();

        $this->saccoA = Sacco::create([
            'name' => 'SACCO Alpha',
            'registration_number' => 'REG-A',
            'status' => 'approved',
            'is_public' => true,
            'is_accepting_members' => true,
            'is_directory_allowed' => true,
        ]);

        $this->saccoB = Sacco::create([
            'name' => 'SACCO Beta',
            'registration_number' => 'REG-B',
            'status' => 'approved',
            'is_public' => true,
            'is_accepting_members' => false,
            'is_directory_allowed' => true,
        ]);

        $this->adminA = User::factory()->create([
            'role' => 'admin',
            'sacco_id' => $this->saccoA->id,
        ]);

        $this->adminB = User::factory()->create([
            'role' => 'admin',
            'sacco_id' => $this->saccoB->id,
        ]);
    }

    public function test_public_visitor_can_submit_membership_request(): void
    {
        $payload = [
            'full_name' => 'Abebe Bikila',
            'email' => 'abebe@example.com',
            'phone_number' => '+251911223344',
            'national_id' => 'ID12345',
            'message' => 'I want to join your SACCO.',
        ];

        $response = $this->postJson("/api/v1/public/saccos/{$this->saccoA->id}/membership-requests", $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.full_name', 'Abebe Bikila')
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('membership_requests', [
            'sacco_id' => $this->saccoA->id,
            'email' => 'abebe@example.com',
            'status' => 'pending',
        ]);
    }

    public function test_cannot_submit_request_when_sacco_not_accepting_members(): void
    {
        $payload = [
            'full_name' => 'Kebede Tessema',
            'email' => 'kebede@example.com',
            'phone_number' => '+251911223355',
        ];

        $response = $this->postJson("/api/v1/public/saccos/{$this->saccoB->id}/membership-requests", $payload);

        $response->assertStatus(422);
    }

    public function test_cannot_submit_duplicate_pending_request(): void
    {
        MembershipRequest::create([
            'sacco_id' => $this->saccoA->id,
            'full_name' => 'Existing Applicant',
            'email' => 'duplicate@example.com',
            'phone_number' => '+251911999888',
            'status' => 'pending',
        ]);

        $payload = [
            'full_name' => 'Existing Applicant',
            'email' => 'duplicate@example.com',
            'phone_number' => '+251911999888',
        ];

        $response = $this->postJson("/api/v1/public/saccos/{$this->saccoA->id}/membership-requests", $payload);

        $response->assertStatus(422);
    }

    public function test_cannot_submit_request_if_email_is_already_a_member(): void
    {
        User::factory()->create([
            'role' => 'member',
            'sacco_id' => $this->saccoA->id,
            'email' => 'member@example.com',
        ]);

        $payload = [
            'full_name' => 'Member Duplicate',
            'email' => 'member@example.com',
            'phone_number' => '+251911999888',
        ];

        $response = $this->postJson("/api/v1/public/saccos/{$this->saccoA->id}/membership-requests", $payload);

        $response->assertStatus(422);
    }

    public function test_admin_can_list_and_view_requests_for_own_sacco_only(): void
    {
        $reqA = MembershipRequest::create([
            'sacco_id' => $this->saccoA->id,
            'full_name' => 'Applicant A',
            'email' => 'appA@example.com',
            'phone_number' => '+251911111111',
            'status' => 'pending',
        ]);

        $reqB = MembershipRequest::create([
            'sacco_id' => $this->saccoB->id,
            'full_name' => 'Applicant B',
            'email' => 'appB@example.com',
            'phone_number' => '+251922222222',
            'status' => 'pending',
        ]);

        // Admin A lists requests -> receives reqA only
        $response = $this->actingAs($this->adminA)->getJson('/api/v1/membership-requests');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $reqA->id);

        // Admin A tries to view reqB -> 404
        $viewResponse = $this->actingAs($this->adminA)->getJson("/api/v1/membership-requests/{$reqB->id}");
        $viewResponse->assertStatus(404);
    }

    public function test_admin_can_approve_request_and_send_invitation(): void
    {
        $reqA = MembershipRequest::create([
            'sacco_id' => $this->saccoA->id,
            'full_name' => 'Approve Me',
            'email' => 'approveme@example.com',
            'phone_number' => '+251911111111',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->adminA)
            ->postJson("/api/v1/membership-requests/{$reqA->id}/approve");

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('membership_requests', [
            'id' => $reqA->id,
            'status' => 'approved',
            'reviewed_by' => $this->adminA->id,
        ]);

        $this->assertDatabaseHas('invitations', [
            'sacco_id' => $this->saccoA->id,
            'email' => 'approveme@example.com',
        ]);

        Notification::assertSentOnDemand(
            MembershipRequestApprovedNotification::class,
            function ($notification, $channels, $notifiable) {
                return $notifiable->routes['mail'] === 'approveme@example.com';
            }
        );
    }

    public function test_admin_can_reject_request_with_reason(): void
    {
        $reqA = MembershipRequest::create([
            'sacco_id' => $this->saccoA->id,
            'full_name' => 'Reject Me',
            'email' => 'rejectme@example.com',
            'phone_number' => '+251911111111',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->adminA)
            ->postJson("/api/v1/membership-requests/{$reqA->id}/reject", [
                'rejection_reason' => 'Ineligible according to bylaws.',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'rejected')
            ->assertJsonPath('data.rejection_reason', 'Ineligible according to bylaws.');

        $this->assertDatabaseHas('membership_requests', [
            'id' => $reqA->id,
            'status' => 'rejected',
            'rejection_reason' => 'Ineligible according to bylaws.',
        ]);

        Notification::assertSentOnDemand(
            MembershipRequestRejectedNotification::class,
            function ($notification, $channels, $notifiable) {
                return $notifiable->routes['mail'] === 'rejectme@example.com';
            }
        );
    }

    public function test_cannot_approve_or_reject_already_processed_request(): void
    {
        $reqA = MembershipRequest::create([
            'sacco_id' => $this->saccoA->id,
            'full_name' => 'Processed',
            'email' => 'processed@example.com',
            'phone_number' => '+251911111111',
            'status' => 'approved',
            'reviewed_by' => $this->adminA->id,
        ]);

        // Attempting to approve again
        $res1 = $this->actingAs($this->adminA)->postJson("/api/v1/membership-requests/{$reqA->id}/approve");
        $res1->assertStatus(422);

        // Attempting to reject approved request
        $res2 = $this->actingAs($this->adminA)->postJson("/api/v1/membership-requests/{$reqA->id}/reject", [
            'rejection_reason' => 'New decision',
        ]);
        $res2->assertStatus(422);
    }
}
