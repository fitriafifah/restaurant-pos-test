<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    public function store(Request $request, Order $order)
    {
        $data = $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id',
            'qty' => 'required|integer|min:1'
        ]);

        $menu = MenuItem::find($data['menu_item_id']);

        $item = $order->items()->create([
            'menu_item_id' => $menu->id,
            'qty' => $data['qty'],
            'price_each' => $menu->price,
            'line_total' => $menu->price * $data['qty'],
        ]);

        // Recalculate totals
        $subtotal = $order->items()->sum('line_total');
        $tax = $subtotal * 0.1;
        $order->update([
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $subtotal + $tax,
        ]);

        return $item->load('menuItem');
    }
}
