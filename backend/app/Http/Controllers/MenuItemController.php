<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index()
    {
        return MenuItem::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean'
        ]);

        return MenuItem::create($data);
    }

    public function show(MenuItem $menuItem)
    {
        return $menuItem;
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $data = $request->validate([
            'name' => 'string',
            'description' => 'nullable|string',
            'price' => 'numeric|min:0',
            'is_active' => 'boolean'
        ]);

        $menuItem->update($data);
        return $menuItem;
    }

    public function destroy(MenuItem $menuItem)
    {
        $menuItem->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
