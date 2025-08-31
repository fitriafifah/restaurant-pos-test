<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    // List orders
    public function index(Request $request)
    {
        $query = Order::with(['table','user','items.menuItem']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return $query->get();
    }

    // Show order detail
    public function show(Order $order)
    {
        return $order->load(['table','user','items.menuItem']);
    }

    // Open order
    public function store(Request $request)
    {
        $data = $request->validate([
            'table_id' => 'required|exists:tables,id'
        ]);

        return DB::transaction(function () use ($data) {
            $table = Table::lockForUpdate()->find($data['table_id']);
            if ($table->status === 'occupied') {
                return response()->json(['message' => 'Table already occupied'], 400);
            }

            $order = Order::create([
                'table_id' => $table->id,
                'user_id' => auth()->id(),
                'status' => 'open',
                'opened_at' => now(),
                'subtotal' => 0,
                'tax' => 0,
                'total' => 0,
            ]);

            $table->update(['status' => 'occupied']);

            return $order->load('table');
        });
    }

    // Close order
    public function close(Order $order)
    {
        if ($order->status === 'closed') {
            return response()->json(['message' => 'Order already closed'], 400);
        }

        $order->update([
            'status' => 'closed',
            'closed_at' => now()
        ]);

        $order->table->update(['status' => 'available']);

        return $order->load(['table','items.menuItem']);
    }

    // Receipt PDF
    public function receipt(Order $order)
    {
    return response()->json([
        'order_id' => $order->id,
        'table' => $order->table->number,
        'status' => $order->status,
        'subtotal' => $order->subtotal,
        'tax' => $order->tax,
        'total' => $order->total,
        'items' => $order->items->map(function ($item) {
            return [
                'name' => $item->menuItem->name,
                'qty' => $item->qty,
                'price_each' => $item->price_each,
                'line_total' => $item->line_total,
            ];
        })
    ]);
    }

}
