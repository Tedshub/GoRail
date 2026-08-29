<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->unsignedInteger('harga_ekonomi')->nullable()->after('harga');
            $table->unsignedInteger('harga_bisnis')->nullable()->after('harga_ekonomi');
            $table->unsignedInteger('harga_eksekutif')->nullable()->after('harga_bisnis');
        });

        // Set nilai awal dari harga eksisting
        DB::table('schedules')->update([
            'harga_ekonomi' => DB::raw('harga'),
            'harga_bisnis' => DB::raw('ROUND(harga * 1.5)'),
            'harga_eksekutif' => DB::raw('ROUND(harga * 2)'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropColumn(['harga_ekonomi', 'harga_bisnis', 'harga_eksekutif']);
        });
    }
};
