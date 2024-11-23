<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::paginate(10); // Paginate results (if you want pagination)
    return Inertia::render("Super Admin/List/Users/UsersList", [
        'users' => $users->items(), // Pass only the items
        'total' => $users->total(), // Pass the total count
    ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Super Admin/List/Users/CreateUser");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'pfp' => 'string|max:255',
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'sex' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        User::create([
            'pfp' => $request->pfp,
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'role' => $request->role,
            'section' => $request->section,
            'sex' => $request->sex,
            'status' => $request->status,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return Inertia::render("Super Admin/List/Users/UserDetail", [
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render("Super Admin/List/Users/EditUser", [
            'user' => $user
        ]);
    } 

    /**
     * Update the specified resource in storage.
     */
            public function update(Request $request, $id)
        {
            $user = User::findOrFail($id);

            
            $request->validate([
                'pfp' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', 
                'firstname' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'role' => 'required|string|max:255',
                'status' => 'required|string|max:255',
                'section' => 'nullable|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $id, 
            ]); 

            
            if ($request->hasFile('pfp')) {
                $fileName = time().'.'.$request->pfp->extension();
                $request->pfp->move(public_path('uploads/profile_pictures'), $fileName);
                $user->pfp = $fileName;
            }

           
            $user->firstname = $request->firstname;
            $user->lastname = $request->lastname;
            $user->role = $request->role;
            $user->status = $request->status;
            $user->section = $request->section;
            $user->email = $request->email;

           
            $user->save();

            return redirect()->route('users.index')->with('success', 'User updated successfully.');
        }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $users = User::find($id);
        if ($users) {
            $users->delete();
            return redirect()->route('users.index')->with('success', 'users updated successfully');
        }
        return response()->json(['message' => 'users not found'], 404);
    }
}