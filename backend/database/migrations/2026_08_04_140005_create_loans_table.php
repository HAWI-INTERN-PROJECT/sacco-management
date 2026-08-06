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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sacco_id')
                ->constrained('saccos')
                ->cascadeOnDelete();
            $table->foreignId('member_id')
                ->constrained('members')
                ->cascadeOnDelete();
            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('loan_number');
            $table->decimal('principal_amount', 15, 2);
            $table->decimal('interest_rate', 5, 2);
            $table->integer('term_months');
            $table->string('status')->default('pending')->index();
            $table->timestamp('applied_at')->useCurrent();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('disbursed_at')->nullable();
            $table->timestamps();

            $table->unique(['sacco_id', 'loan_number']);
            $table->index(['sacco_id', 'status']);
            $table->index(['sacco_id', 'member_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
