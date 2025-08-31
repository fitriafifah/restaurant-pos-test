<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Waiter',
                'email' => 'waiter@example.com',
                'password' => Hash::make('password'),
                'role' => 'pelayan', // pastikan nanti tambahin kolom role di users
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cashier',
                'email' => 'cashier@example.com',
                'password' => Hash::make('password'),
                'role' => 'kasir',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
