<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('repayments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sacco_id')
                ->constrained('saccos')
                ->cascadeOnDelete();
            $table->foreignId('loan_id')
                ->constrained('loans')
                ->cascadeOnDelete();
            $table->foreignId('loan_schedule_id')
                ->nullable()
                ->constrained('loan_schedules')
                ->nullOnDelete();
            $table->foreignId('received_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('payment_reference')->unique();
            $table->decimal('amount_paid', 15, 2);
            $table->decimal('principal_portion', 15, 2)->default(0.00);
            $table->decimal('interest_portion', 15, 2)->default(0.00);
            $table->decimal('penalty_portion', 15, 2)->default(0.00);
            $table->string('payment_method');
            $table->timestamp('paid_at')->useCurrent();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['sacco_id', 'loan_id']);
            $table->index('paid_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repayments');
    }
};
