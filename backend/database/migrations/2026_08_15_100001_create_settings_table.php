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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sacco_id')->unique()->constrained('saccos')->cascadeOnDelete();
            $table->decimal('loan_interest_rate', 5, 2)->default(0);
            $table->decimal('savings_interest_rate', 5, 2)->default(0);
            $table->decimal('dividend_rate', 5, 2)->default(0);
            $table->string('currency', 10)->default('KES');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
