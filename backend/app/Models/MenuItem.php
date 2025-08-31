<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'price', 'is_active'];

    // Satu menu bisa ada di banyak order item
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
