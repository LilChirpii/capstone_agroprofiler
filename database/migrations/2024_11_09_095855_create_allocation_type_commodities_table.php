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
        Schema::create('allocation_type_commodities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('allocation_type_id')
            ->constrained('allocation_types') 
            ->onDelete('cascade');
            $table->foreignId('commodity_id')
            ->constrained('commodities')
            ->onDelete('cascade');
            
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allocation_type_commodities');
    }
};