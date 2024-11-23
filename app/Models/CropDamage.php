<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CropDamage extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id',
        'cause',
        'commodity_id',
        'brgy_id',
        'total_damaged_area',
        'partially_damaged_area',
        'area_affected',
        'remarks',
    ];

    public function farmer()
    {
        return $this->belongsTo(Farmer::class);
    }

    public function commodity()
    {
        return $this->belongsTo(Commodity::class);
    }

    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'brgy_id');
    }

     public function cropDamageCause()
     {
         return $this->belongsTo(CropDamageCause::class);
     }
}