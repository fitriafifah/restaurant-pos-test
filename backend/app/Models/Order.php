<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_id', 'user_id', 'status',
        'subtotal', 'tax', 'total', 'opened_at', 'closed_at'
    ];

    // Order milik satu meja
    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class);
    }

    // Order dibuka oleh satu user (pelayan/kasir)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Order punya banyak item
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
