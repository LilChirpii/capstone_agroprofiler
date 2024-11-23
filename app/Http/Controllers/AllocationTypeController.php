<?php

namespace App\Http\Controllers;

use App\Models\AllocationType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AllocationTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Super Admin/List/Allocation_Type/Allocation_type_list");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(AllocationType $allocationType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AllocationType $allocationType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AllocationType $allocationType)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AllocationType $allocationType)
    {
        //
    }
}