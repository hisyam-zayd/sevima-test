<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('posts', [PostController::class, 'index']);

Route::middleware('auth:sanctum')->group(function() {
    // auth    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // posts
    Route::post('posts', [PostController::class, 'store']);
    Route::get('posts/{post}', [PostController::class, 'show']);
    Route::put('posts/{post}', [PostController::class, 'update']);
    Route::delete('posts/{post}', [PostController::class, 'destroy']);
});