<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; // <-- tambahkan ini
use App\Http\Controllers\TableController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\ReceiptController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route default Laravel
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Route tambahan untuk login dan logout
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/tables', [TableController::class, 'index']);

// --------- PROTECTED ROUTES ----------
Route::middleware('auth:sanctum')->group(function () {

    // Menu
    Route::apiResource('menu-items', MenuItemController::class);

    // Orders
    Route::get('orders', [OrderController::class, 'index']);
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/{order}', [OrderController::class, 'show']);
    Route::patch('orders/{order}/close', [OrderController::class, 'close']);
    Route::get('orders/{order}/receipt', [OrderController::class, 'receipt']);

    // Order Items
    Route::post('orders/{order}/items', [OrderItemController::class, 'store']);

    // Receipt (PDF)
    //Route::post('/orders/{order}/receipt', [ReceiptController::class, 'pdf']);
});
