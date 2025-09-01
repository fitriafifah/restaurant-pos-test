<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\MenuItem;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    // ====== Tambah Item ======
    public function store(Request $request, Order $order)
    {
        $data = $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id',
            'qty'          => 'required|integer|min:1',
        ]);

        $menu = MenuItem::findOrFail($data['menu_item_id']);

        // Jika item sudah ada, update qty
        $item = $order->items()->where('menu_item_id', $menu->id)->first();
        if ($item) {
            $item->update([
                'qty'       => $item->qty + $data['qty'],
                'line_total'=> ($item->qty + $data['qty']) * $menu->price,
            ]);
        } else {
            $item = $order->items()->create([
                'menu_item_id' => $menu->id,
                'qty'          => $data['qty'],
                'price_each'   => $menu->price,
                'line_total'   => $menu->price * $data['qty'],
            ]);
        }

        $this->recalc($order);

        return $item->load('menuItem');
    }

    // ====== Update Qty Item ======
    public function update(Request $request, Order $order, OrderItem $item)
    {
        $data = $request->validate([
            'qty' => 'required|integer|min:1',
        ]);

        $item->update([
            'qty'        => $data['qty'],
            'line_total' => $item->price_each * $data['qty'],
        ]);

        $this->recalc($order);

        return $item->load('menuItem');
    }

    // ====== Hapus Item ======
    public function destroy(Order $order, OrderItem $item)
    {
        $item->delete();

        $this->recalc($order);

        return response()->json(['message' => 'Item deleted']);
    }

    // ====== Helper Recalculate Totals ======
    private function recalc(Order $order)
    {
        $subtotal = $order->items()->sum('line_total');
        $tax = $subtotal * 0.1;
        $order->update([
            'subtotal' => $subtotal,
            'tax'      => $tax,
            'total'    => $subtotal + $tax,
        ]);
    }
}
