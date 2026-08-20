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
        Schema::table('repayments', function (Blueprint $table) {
            $table->foreignId('loan_schedule_id')
                ->nullable()
                ->after('user_id')
                ->constrained('loan_schedules')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('repayments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('loan_schedule_id');
        });
    }
};
