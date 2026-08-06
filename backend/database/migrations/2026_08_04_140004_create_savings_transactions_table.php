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
        Schema::create('savings_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sacco_id')
                ->constrained('saccos')
                ->cascadeOnDelete();
            $table->foreignId('member_id')
                ->constrained('members')
                ->cascadeOnDelete();
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('transaction_type')->index();
            $table->decimal('amount', 15, 2);
            $table->decimal('balance_after', 15, 2);
            $table->string('reference')->unique();
            $table->timestamp('transaction_date')->useCurrent();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['sacco_id', 'member_id']);
            $table->index('transaction_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('savings_transactions');
    }
};
