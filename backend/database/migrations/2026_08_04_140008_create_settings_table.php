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
            $table->foreignId('sacco_id')
                ->nullable()
                ->constrained('saccos')
                ->cascadeOnDelete();
            $table->string('key')->index();
            $table->text('value')->nullable();
            $table->string('group')->default('general')->index();
            $table->timestamps();

            $table->unique(['sacco_id', 'key']);
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
