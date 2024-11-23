<?php

namespace Database\Factories;

use App\Models\AllocationType;
use App\Models\Barangay;
use App\Models\Commodity;
use App\Models\Farmer;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Allocation>
 */
class AllocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $farmer = Farmer::inRandomOrder()->first() ?? Farmer::factory()->create();
        return [
            'allocation_type_id' => AllocationType::inRandomOrder()->first()->id ?? AllocationType::factory()->create()->id,
            'farmer_id' => $farmer->id,
            'received' => $this->faker->randomElement(['yes', 'no']),
            'date_received' => $this->faker->optional()->date(),
            'commodity_id' => Commodity::inRandomOrder()->first()->id ?? Commodity::factory()->create()->id,
            'brgy_id' => $farmer->brgy_id, // Set brgy_id based on the farmer's brgy_id
            'created_at' => $this->faker->dateTimeBetween('2019-01-01', '2024-12-31'),
            'updated_at' => Carbon::now(),
        ];
    } 
}