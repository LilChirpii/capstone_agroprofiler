<?php

namespace Database\Seeders;

use App\Models\Eligible;
use App\Models\Elligibility;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EligibleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Elligibility::truncate();
        
        $commodities = include database_path('data/eligible.php');
        foreach ($commodities as $commodity) {
            Elligibility::create($commodity);
        }
    }
}