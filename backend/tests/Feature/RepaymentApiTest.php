<?php

namespace Tests\Feature;

use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Models\Sacco;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RepaymentApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->sacco = Sacco::create([
            'name' => 'Test Sacco',
            'registration_number' => 'TS123',
            'share_value' => 100
        ]);
        $this->admin = User::factory()->create([
            'sacco_id' => $this->sacco->id,
            'role' => 'admin',
        ]);
        $this->member = User::factory()->create([
            'sacco_id' => $this->sacco->id,
            'role' => 'member',
        ]);
        $this->loan = Loan::factory()->create([
            'sacco_id' => $this->sacco->id,
            'user_id' => $this->member->id,
            'status' => 'active',
            'amount' => 1000,
        ]);
    }

    public function test_admin_can_record_repayment()
    {
        $this->actingAs($this->admin);

        $schedule = LoanSchedule::create([
            'loan_id' => $this->loan->id,
            'installment_number' => 1,
            'due_date' => now()->addDays(30),
            'amount_due' => 100,
            'paid_amount' => 0,
            'status' => 'pending',
        ]);

        $response = $this->postJson('/api/v1/repayments', [
            'loan_schedule_id' => $schedule->id,
            'amount' => 100,
            'payment_date' => now()->toDateString(),
            'notes' => 'Full payment',
        ]);

        $response->dump();
        $response->assertStatus(200);

        $this->assertDatabaseHas('repayments', [
            'loan_schedule_id' => $schedule->id,
            'amount' => 100,
        ]);

        $this->assertDatabaseHas('loan_schedules', [
            'id' => $schedule->id,
            'status' => 'paid',
            'paid_amount' => 100,
        ]);
    }

    public function test_admin_can_get_overdue_repayments()
    {
        $this->actingAs($this->admin);

        LoanSchedule::create([
            'loan_id' => $this->loan->id,
            'installment_number' => 1,
            'due_date' => now()->subDays(5),
            'amount_due' => 100,
            'paid_amount' => 0,
            'status' => 'pending',
        ]);

        $response = $this->getJson('/api/v1/repayments/overdue');

        $response->assertStatus(200)
            ->assertJsonPath('data.count', 1);
    }
}
