<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\Farmer;
use Illuminate\Http\Request;
use Inertia\Inertia; 

class FarmerController extends Controller
{
    /**
     * Display a listing of the farmers.
     */
    public function index(Request $request) 
    {
        $farmers = Farmer::with('barangay')->paginate(20);  
        return Inertia::render('Super Admin/List/Farmers/FarmerList', [
            'farmers' => $farmers,  
            'barangays' => Barangay::all(),
        ]);
    }

    /**
     * Show the form for creating a new farmer.
     */
    public function create()
    {
        // Render the form to create a new farmer
        return Inertia::render('Super Admin/List/Farmers/CreateFarmer');
    }

    /**
     * Store a newly created farmer in storage.
     */
    public function store(Request $request) 
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'dob' => 'required|date',
            'age' => 'required|integer',
            'sex' => 'required|string',
            'status' => 'required|string',
            'coop' => 'nullable|string',
            'pwd' => 'required|string',
            '4ps' => 'required|string',
            'brgy_id' => 'required|exists:barangays,id',  
        ]);
    
        Farmer::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'dob' => $request->dob,
            'age' => $request->age,
            'sex' => $request->sex,
            'status' => $request->status,
            'coop' => $request->coop,
            'pwd' => $request->pwd,
            '4ps' => $request->input('4ps'), 
            'brgy_id' => $request->brgy_id, 
        ]);
        
        return redirect()->route('farmers.index')->with('success', 'Farmer added successfully');
    }
    
    /**
     * Show the form for editing the specified farmer.
     */
    public function edit(Farmer $farmer)
    {
        return Inertia::render('Super Admin/List/Farmers/EditFarmer', [
            'farmer' => $farmer->load('barangay'),  
        ]);
    }

    /**
     * Update the specified farmer in storage.
     */
    public function update(Request $request, $id)
    {
        $farmer = Farmer::findOrFail($id);
        
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'dob' => 'required|date',
            'age' => 'required|integer',
            'sex' => 'required|string',
            'status' => 'required|string',
            'coop' => 'nullable|string',
            'pwd' => 'required|string',
            '4ps' => 'required|string',
            'brgy_id' => 'required|exists:barangays,id',  
        ]);

        $farmer->update([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'dob' => $request->dob,
            'age' => $request->age,
            'sex' => $request->sex,
            'status' => $request->status,
            'coop' => $request->coop,
            'pwd' => $request->pwd,
            '4ps' => $request->input('4ps'),
            'brgy_id' => $request->brgy_id, 
        ]);

        return redirect()->route('farmers.index')->with('success', 'Farmer updated successfully');
    }

    /**
     * Remove the specified farmer from storage.
     */
    public function destroy($id)
    {
        $farmer = Farmer::find($id);
        if ($farmer) {
            $farmer->delete();
            return redirect()->route('farmers.index')->with('success', 'Farmer updated successfully');
        }
        return response()->json(['message' => 'Farmer not found'], 404);
        
    }
}