<?php

namespace Tests\Feature;

use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Models\Sacco;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RepaymentTest extends TestCase
{
    use RefreshDatabase;

    private Sacco $sacco;

    private Sacco $otherSacco;

    private User $admin;

    private User $member;

    private User $otherMember;

    private Loan $loan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->sacco = Sacco::create(['name' => 'Sacco A', 'registration_number' => 'REG-A', 'status' => 'approved']);
        $this->otherSacco = Sacco::create(['name' => 'Sacco B', 'registration_number' => 'REG-B', 'status' => 'approved']);

        $this->admin = User::factory()->create(['role' => 'admin', 'sacco_id' => $this->sacco->id]);
        $this->member = User::factory()->create(['role' => 'member', 'sacco_id' => $this->sacco->id]);
        $this->otherMember = User::factory()->create(['role' => 'member', 'sacco_id' => $this->otherSacco->id]);

        $this->loan = Loan::create([
            'sacco_id' => $this->sacco->id,
            'member_id' => $this->member->id,
            'principal_amount' => 1000,
            'interest_rate' => 10,
            'term_months' => 2,
            'status' => 'active',
        ]);

        LoanSchedule::create([
            'loan_id' => $this->loan->id,
            'installment_number' => 1,
            'due_date' => now()->subDays(5),
            'principal_due' => 500,
            'interest_due' => 50,
            'total_due' => 550,
            'amount_paid' => 0,
            'status' => 'pending',
        ]);

        LoanSchedule::create([
            'loan_id' => $this->loan->id,
            'installment_number' => 2,
            'due_date' => now()->addDays(25),
            'principal_due' => 500,
            'interest_due' => 50,
            'total_due' => 550,
            'amount_paid' => 0,
            'status' => 'pending',
        ]);
    }

    public function test_member_cannot_record_repayment(): void
    {
        $this->actingAs($this->member)
            ->postJson("/api/v1/loans/{$this->loan->id}/repayments", ['amount' => 100])
            ->assertStatus(403);
    }

    public function test_admin_cannot_record_repayment_for_another_saccos_loan(): void
    {
        $this->actingAs($this->admin)
            ->postJson('/api/v1/loans/999999/repayments', ['amount' => 100])
            ->assertStatus(404);
    }

    public function test_admin_can_record_partial_repayment(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/loans/{$this->loan->id}/repayments", ['amount' => 300]);

        $response->assertStatus(201)
            ->assertJsonPath('data.amount', 300);

        $this->assertDatabaseHas('loan_schedules', [
            'loan_id' => $this->loan->id,
            'installment_number' => 1,
            'amount_paid' => 300,
            'status' => 'partial',
        ]);
    }

    public function test_repayment_rolls_over_into_next_installment(): void
    {
        $this->actingAs($this->admin)
            ->postJson("/api/v1/loans/{$this->loan->id}/repayments", ['amount' => 600]);

        $this->assertDatabaseHas('loan_schedules', [
            'installment_number' => 1,
            'amount_paid' => 550,
            'status' => 'paid',
        ]);

        $this->assertDatabaseHas('loan_schedules', [
            'installment_number' => 2,
            'amount_paid' => 50,
            'status' => 'partial',
        ]);
    }

    public function test_loan_marked_completed_once_fully_paid(): void
    {
        $this->actingAs($this->admin)
            ->postJson("/api/v1/loans/{$this->loan->id}/repayments", ['amount' => 1100]);

        $this->assertDatabaseHas('loans', [
            'id' => $this->loan->id,
            'status' => 'completed',
        ]);
    }

    public function test_member_can_view_only_their_own_loan_repayments(): void
    {
        $this->actingAs($this->admin)
            ->postJson("/api/v1/loans/{$this->loan->id}/repayments", ['amount' => 100]);

        $this->actingAs($this->member)
            ->getJson("/api/v1/loans/{$this->loan->id}/repayments")
            ->assertStatus(200)
            ->assertJsonCount(1, 'data');

        $this->actingAs($this->otherMember)
            ->getJson("/api/v1/loans/{$this->loan->id}/repayments")
            ->assertStatus(404);
    }

    public function test_overdue_endpoint_lists_only_overdue_installments(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/repayments/overdue');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.installment_number', 1);
    }

    public function test_member_sees_only_their_own_overdue_installments(): void
    {
        $response = $this->actingAs($this->member)->getJson('/api/v1/repayments/overdue');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_admin_from_other_sacco_sees_no_overdue_installments(): void
    {
        $otherAdmin = User::factory()->create(['role' => 'admin', 'sacco_id' => $this->otherSacco->id]);

        $response = $this->actingAs($otherAdmin)->getJson('/api/v1/repayments/overdue');

        $response->assertStatus(200)->assertJsonCount(0, 'data');
    }
}
