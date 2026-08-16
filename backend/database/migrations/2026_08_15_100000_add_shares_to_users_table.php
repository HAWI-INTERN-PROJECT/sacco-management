<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * The `users` table (with role='member') already serves as the
     * "members" entity. The only thing missing to support the member
     * share-capital workflow is a running share balance, so we add
     * that single column rather than creating a duplicate table.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('shares', 12, 2)->default(0)->after('sacco_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('shares');
        });
    }
};
