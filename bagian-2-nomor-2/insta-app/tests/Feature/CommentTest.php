<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CommentTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_comment(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/comments', [
            'post_id' => $post->id,
            'content' => 'tes komentar',
        ]);

        $response->assertStatus(201)->assertJson(['content' => 'tes komentar']);
    }

    public function test_user_can_get_all_comments(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        Comment::factory()->count(3)->create(['post_id' => $post->id]);

        $response = $this->actingAs($user)->getJson('/api/comments?post_id=' . $post->id);

        $response->assertStatus(200)->assertJsonCount(3);
    }

    public function test_user_can_update_own_comment(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->putJson('/api/comments/' . $comment->id, [
            'content' => 'contoh update komen',
        ]);

        $response->assertStatus(200)->assertJson(['content' => 'contoh update komen']);
    }

    public function test_user_cannot_update_other_comment(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $comment = Comment::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->putJson('/api/comments/' . $comment->id, [
            'content' => 'contoh update komen',
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_own_comment(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->deleteJson('/api/comments/' . $comment->id);

        $response->assertStatus(204);
    }
}
