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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('train_id')->constrained()->cascadeOnDelete();
            $table->foreignId('station_asal_id')->constrained('stations')->cascadeOnDelete();
            $table->foreignId('station_tujuan_id')->constrained('stations')->cascadeOnDelete();
            $table->dateTime('waktu_berangkat');
            $table->dateTime('waktu_tiba');
            $table->unsignedInteger('harga');
            $table->string('kode_jadwal')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
