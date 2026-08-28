<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    private const DEFAULT_PASSWORD = 'Password123_';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hashedPassword = Hash::make(self::DEFAULT_PASSWORD);

        $daftarPengguna = [
            [
                'name'  => 'Administrator GoRail',
                'email' => 'admin@gorail.test',
                'role'  => 'admin',
            ],
            [
                'name'  => 'Petugas Loket & Staff',
                'email' => 'staff@gorail.test',
                'role'  => 'staff',
            ],
            [
                'name'  => 'Customer Demo (Budi Santoso)',
                'email' => 'customer@gorail.test',
                'role'  => 'customer',
            ],
            [
                'name'  => 'Siti Rahmawati',
                'email' => 'siti@gorail.test',
                'role'  => 'customer',
            ],
        ];

        foreach ($daftarPengguna as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name'              => $data['name'],
                    'password'          => $hashedPassword,
                    'email_verified_at' => now(),
                ]
            );

            $user->syncRoles([$data['role']]);
        }
    }
}


