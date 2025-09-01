<?php

namespace App\Http\Controllers;

use App\Models\Table;
use App\Models\Order;
use Illuminate\Http\Request;

class TableController extends Controller
{
    public function index()
    {
        // Ambil semua meja
        $tables = Table::all();

        // Tambahkan info order_id kalau ada order OPEN
        $tables = $tables->map(function ($table) {
            $openOrder = Order::where('table_id', $table->id)
                ->where('status', 'open')
                ->latest()
                ->first();

            return [
                'id' => $table->id,
                'number' => $table->number,
                'status' => $openOrder ? 'occupied' : 'available',
                'order_id' => $openOrder ? $openOrder->id : null,
            ];
        });

        return response()->json($tables);
    }
}
