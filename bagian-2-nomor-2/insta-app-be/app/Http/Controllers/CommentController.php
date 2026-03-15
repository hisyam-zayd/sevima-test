<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $comments = Comment::with('user')->where('post_id', $request->post_id)->latest()->get();
        return response()->json($comments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'content' => 'required|string|max:1000'
        ]);

        $comment = Comment::create(array_merge($validated, ['user_id' => auth()->id()]));
        return response()->json($comment, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        if ($comment->user_id !== auth()->id()) {
            abort(403, 'unauthorized action!');
        }

        $validated = $request->validate(['content' => 'required|string|max:1000']);
        $comment->update($validated);
        return response()->json($comment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment): JsonResponse
    {
        if ($comment->user_id !== auth()->id()) {
            abort(403, 'unauthorized action!');
        }

        $comment->delete();
        return response()->json(null, 204);
    }
}
