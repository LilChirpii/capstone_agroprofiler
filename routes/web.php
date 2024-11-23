<?php

use App\Http\Controllers\AllocationController;
use App\Http\Controllers\AllocationTypeController;
use App\Http\Controllers\CommodityController;
use App\Http\Controllers\CropActivityController;
use App\Http\Controllers\CropDamagesController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\FarmerController;
use App\Http\Controllers\FarmProfileController;
use App\Http\Controllers\GeospatialController;
use App\Http\Controllers\ImagesController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UsersController;
use App\Models\AllocationType;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () { 
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION, 
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::get('/report/resource-allocation-breakdown', [RecommendationController::class, 'generateAllocationBreakdownReport']);


Route::get('/generate-report', [RecommendationController::class, 'generateReport']);

// Route::get('/report/get-elligible-farmers', [RecommendationController::class, 'getEligibleFarmers']);

Route::middleware('auth')->group(function () {

    //dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/heatmap-data', [DashboardController::class, 'getHeatmapData']);

    //allocation type
    Route::get('/allocation/allocationtype', [AllocationTypeController::class, 'index'])->name('allocation.type.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/commodities', [CommodityController::class, 'index'])->name('commodities.index');
    Route::post('/commodities/store', [CommodityController::class, 'store'])->name('commodities.store');

    //users
    Route::get('/users', [UsersController::class, 'index'])->name('users.index');
    Route::delete('/users/destroy/{id}', [UsersController::class, 'destroy'])->name('users.destroy'); 
    Route::post('/users/store', [UsersController::class, 'store'])->name('users.store');
    Route::patch('/users/update/{id}', [UsersController::class, 'update'])->name('users.update');

    Route::get('/map/farm', [MapController::class, 'index'])->name('map.index');

    //farmprofile
    Route::get('/farmprofile/{id}', [FarmProfileController::class, 'index'])->name('farm.profile.index');
    
    //Farmers
    Route::get('/farmers', [FarmerController::class, 'index'])->name('farmers.index');
    Route::post('/farmers/store', [FarmerController::class, 'store'])->name('farmers.store');
    Route::patch('/farmers/update/{id}', [FarmerController::class, 'update'])->name('farmers.update');
    Route::delete('/farmers/destroy/{id}', [FarmerController::class, 'destroy'])->name('farmers.destroy'); 

    //allocations
    Route::get('/allocations', [AllocationController::class, 'index'])->name('allocations.index');
    Route::delete('/allocations/destroy/{id}', [AllocationController::class, 'destroy'])->name('allocation.destroy'); 
    Route::post('/allocations/store', [AllocationController::class, 'store'])->name('allocation.store'); 
    Route::put('/allocations/update/{id}', [AllocationController::class, 'update'])->name('allocation.update');

    //cropdamages
    Route::get('/cropdamages', [CropDamagesController::class, 'index'])->name('crop.damages.index');
    Route::delete('/cropdamages/destroy/{id}', [CropDamagesController::class, 'destroy'])->name('crop.damages.destroy'); 
    Route::post('/cropdamages/store', [CropDamagesController::class, 'store'])->name('crop.damages.store');
    
   //cropactivity
    Route::get('/cropactivity', [CropActivityController::class, 'index'])->name('crop.activity.index');
    Route::patch('/cropactivity/update/{id}', [CropActivityController::class, 'update'])->name('crop.activity.update');
    Route::delete('/cropactivity/destroy/{id}', [CropActivityController::class, 'destroy'])->name('crop.activity.destroy');
    Route::post('/cropactivity/store', [CropActivityController::class, 'store'])->name('crop.activity.store');
    Route::delete('/cropactivity/destroy/{id}', [CropActivityController::class, 'destroy'])->name('crop.activity.destroy'); 

    //images
    Route::get('/cropactivity/images/{id}', [ImagesController::class, 'images'])->name('crop.activity.images');
    Route::post('/cropactivity/images/store', [ImagesController::class, 'store'])->name('crop.activity.store');
    // Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::delete('/images/{id}', [ImagesController::class, 'destroy']);

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::get('/recommendations', [RecommendationController::class, 'index'])->name('recommendations.index');
    Route::get('/export-pdf', [ExportController::class, 'exportPDF']);
    Route::get('/geospatial', [GeospatialController::class, 'index'])->name('geospatial.index');

    Route::post('/recommend-allocations', [RecommendationController::class, 'recommendAllocations']);
    Route::get('/api/recommend-allocations', [RecommendationController::class, 'recommendAllocations']);
    Route::get('/allocation-types', [RecommendationController::class, 'listAllocationTypes']);
}); 

require __DIR__.'/auth.php';