<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $daftarRole = ['customer', 'staff', 'admin'];

        foreach ($daftarRole as $namaRole) {
            Role::firstOrCreate(['name' => $namaRole, 'guard_name' => 'web']);
        }
    }
}
