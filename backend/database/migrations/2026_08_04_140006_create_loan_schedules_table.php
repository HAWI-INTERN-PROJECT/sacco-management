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
        Schema::create('loan_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')
                ->constrained('loans')
                ->cascadeOnDelete();
            $table->integer('installment_number');
            $table->date('due_date')->index();
            $table->decimal('principal_due', 15, 2);
            $table->decimal('interest_due', 15, 2);
            $table->decimal('total_due', 15, 2);
            $table->decimal('principal_paid', 15, 2)->default(0.00);
            $table->decimal('interest_paid', 15, 2)->default(0.00);
            $table->string('status')->default('pending')->index();
            $table->timestamps();

            $table->unique(['loan_id', 'installment_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_schedules');
    }
};
