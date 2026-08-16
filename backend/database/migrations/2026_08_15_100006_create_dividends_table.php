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
        Schema::create('dividends', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sacco_id')->constrained('saccos')->cascadeOnDelete();
            $table->foreignId('member_id')->constrained('users')->cascadeOnDelete();
            $table->string('period');
            $table->decimal('shares_at_calculation', 12, 2);
            $table->decimal('rate', 5, 2);
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['calculated', 'distributed'])->default('calculated');
            $table->timestamp('calculated_at');
            $table->timestamp('distributed_at')->nullable();
            $table->foreignId('calculated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('distributed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['sacco_id', 'member_id', 'period']);
            $table->index(['sacco_id', 'period']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dividends');
    }
};
