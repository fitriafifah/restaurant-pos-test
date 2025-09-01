<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Semua route untuk aplikasi POS restoran
*/

//
// 🔑 AUTH
//
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

//
// 📋 PUBLIC
//
Route::get('/tables', [TableController::class, 'index']); 
// 👉 Bisa dipindah ke dalam middleware kalau mau proteksi

//
// 🔒 PROTECTED
//
Route::middleware('auth:sanctum')->group(function () {

    // 🍽️ Master Menu
    Route::apiResource('menu-items', MenuItemController::class);

    // 🧾 Orders
    Route::get('orders', [OrderController::class, 'index']);
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/{order}', [OrderController::class, 'show']);
    Route::patch('orders/{order}/close', [OrderController::class, 'close']);
    Route::patch('orders/{order}/reopen', [OrderController::class, 'reopen']);
    Route::get('orders/{order}/receipt', [OrderController::class, 'receipt']); // Download PDF struk

    // 🥘 Order Items
    Route::post('orders/{order}/items', [OrderItemController::class, 'store']);
    Route::put('orders/{order}/items/{item}', [OrderItemController::class, 'update']);
    Route::delete('orders/{order}/items/{item}', [OrderItemController::class, 'destroy']);
});
