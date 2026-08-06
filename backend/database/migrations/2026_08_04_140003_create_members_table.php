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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sacco_id')
                ->constrained('saccos')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('member_number');
            $table->string('id_number')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('status')->default('active')->index();
            $table->date('joined_at')->nullable();
            $table->timestamps();

            $table->unique(['sacco_id', 'member_number']);
            $table->unique(['sacco_id', 'user_id']);
            $table->index('id_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
