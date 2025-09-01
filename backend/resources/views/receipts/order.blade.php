<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Struk Pesanan #{{ $order->id }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            margin: 20px;
        }
        h2, h3 {
            text-align: center;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            padding: 5px;
            border-bottom: 1px dashed #aaa;
            text-align: left;
        }
        .right { text-align: right; }
        .total {
            margin-top: 10px;
            border-top: 1px solid #000;
            padding-top: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Restaurant POS</h2>
        <h3>Struk Pesanan</h3>
        <p>Order #{{ $order->id }} | Meja #{{ $order->table->number }}</p>
        <p>Tanggal: {{ $order->created_at->format('d/m/Y H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Menu</th>
                <th class="right">Qty</th>
                <th class="right">Harga</th>
                <th class="right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->menuItem->name }}</td>
                    <td class="right">{{ $item->qty }}</td>
                    <td class="right">Rp {{ number_format($item->price_each, 0, ',', '.') }}</td>
                    <td class="right">Rp {{ number_format($item->line_total, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">
        <p>Subtotal: <span class="right">Rp {{ number_format($order->subtotal, 0, ',', '.') }}</span></p>
        <p>PPN (10%): <span class="right">Rp {{ number_format($order->tax, 0, ',', '.') }}</span></p>
        <h3>Total: Rp {{ number_format($order->total, 0, ',', '.') }}</h3>
    </div>

    <div class="footer">
        <p>Terima kasih telah berkunjung 🙏</p>
    </div>
</body>
</html>
