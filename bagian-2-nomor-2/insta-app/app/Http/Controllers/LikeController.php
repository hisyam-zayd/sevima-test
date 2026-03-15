<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $likes = Like::with('user')->where('post_id', $request->post_id)->get();
        return response()->json($likes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id'
        ]);

        $like = Like::firstOrCreate([
            'user_id' => auth()->id(),
            'post_id' => $validated['post_id']
        ]);

        return response()->json($like, 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id'
        ]);

        $like = Like::where('user_id', auth()->id())
            ->where('post_id', $validated['post_id'])
            ->first();

        if ($like) {
            $like->delete();
        }

        return response()->json(null, 204);
    }
}
