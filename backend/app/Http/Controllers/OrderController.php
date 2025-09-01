<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Table;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    // ====== List Orders ======
    public function index(Request $request)
    {
    $query = Order::with('table')->latest();

    // ✅ filter status open / closed jika ada query param
    if ($request->has('status')) {
        $query->where('status', $request->status);
    }

    return $query->get();
    }


    // ====== Create New Order ======
    public function store(Request $request)
    {
        $data = $request->validate([
            'table_id' => 'required|exists:tables,id',
        ]);

        $table = Table::findOrFail($data['table_id']);

        // Tandai meja sebagai occupied
        $table->update(['status' => 'occupied']);

        $order = Order::create([
            'table_id' => $table->id,
            'status'   => 'open',
            'subtotal' => 0,
            'tax'      => 0,
            'total'    => 0,
        ]);

        return response()->json($order->load('table'), 201);
    }

    // ====== Show Order Detail ======
    public function show(Order $order)
    {
        $order->load(['items.menuItem', 'table']);

        // Hitung ulang total setiap kali ditampilkan
        $subtotal = $order->items->sum('line_total');
        $tax = $subtotal * 0.1;
        $total = $subtotal + $tax;

        $order->update([
            'subtotal' => $subtotal,
            'tax'      => $tax,
            'total'    => $total,
        ]);

        return response()->json([
            'id'           => $order->id,
            'table_number' => $order->table->number,
            'status'       => $order->status,
            'items'        => $order->items->map(fn($i) => [
                'id'       => $i->id,
                'menu_item_id' => $i->menu_item_id,
                'name'     => $i->menuItem->name,
                'price'    => $i->price_each,
                'qty'      => $i->qty,
                'subtotal' => $i->line_total,
            ]),
            'subtotal' => $subtotal,
            'tax'      => $tax,
            'total'    => $total,
        ]);
    }

    // ====== Close Order ======
    public function close(Order $order)
    {
        $order->update(['status' => 'closed']);

        // Bebaskan meja
        $order->table->update(['status' => 'available']);

        return response()->json([
            'message' => 'Order closed',
            'order'   => $order->fresh(),
        ]);
    }

    // ====== Reopen Order ======
    public function reopen(Order $order)
    {
        $order->update(['status' => 'open']);

        // Tandai meja jadi occupied lagi
        $order->table->update(['status' => 'occupied']);

        return response()->json([
            'message' => 'Order reopened',
            'order'   => $order->fresh(),
        ]);
    }

    // ====== Print Receipt ======
    public function receipt(Order $order)
    {
    $order->load('items.menuItem', 'table');

    $pdf = Pdf::loadView('receipts.order', compact('order'))
              ->setPaper('A5', 'portrait'); // kertas kecil kayak nota

    return $pdf->download("receipt-{$order->id}.pdf");
    }
}
