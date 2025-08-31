<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = ['order_id','menu_item_id','qty','price_each','line_total'];

    // Item milik satu order
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // Item terkait dengan satu menu
    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class);
    }
}
