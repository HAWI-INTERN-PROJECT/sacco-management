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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('sacco_id')
                ->nullable()
                ->after('id')
                ->constrained('saccos')
                ->nullOnDelete();
            $table->string('role')->default('member')->after('remember_token')->index();
            $table->boolean('is_active')->default(true)->after('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['sacco_id']);
            $table->dropColumn(['sacco_id', 'role', 'is_active']);
        });
    }
};
