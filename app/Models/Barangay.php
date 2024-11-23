<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    use HasFactory;

    protected $guarded = [
        'name',
    ];

    public function farmers()
    {
        return $this->hasMany(Farmer::class, 'brgy_id');
    }

    public function allocations()
    {
        return $this->hasMany(Allocation::class, 'brgy_id'); 
    }
}