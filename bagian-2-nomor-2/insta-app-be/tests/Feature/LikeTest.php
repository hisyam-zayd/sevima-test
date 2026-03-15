<?php

namespace Tests\Feature;

use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LikeTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_like_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/likes', [
            'post_id' => $post->id,
        ]);

        $response->assertStatus(201)->assertJson(['post_id' => $post->id]);
    }

    public function test_user_can_get_all_likes(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        Like::factory()->count(3)->create(['post_id' => $post->id]);

        $response = $this->actingAs($user)->getJson('api/likes?post_id=' . $post->id);

        $response->assertStatus(200)->assertJsonCount(3);
    }

    public function test_user_can_unlike_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();
        $like = Like::factory()->create(['user_id' => $user->id, 'post_id' => $post->id]);

        $response = $this->actingAs($user)->deleteJson('/api/likes/' . $like->id, [
            'post_id' => $post->id,
        ]);

        $response->assertStatus(204);
    }

    public function test_user_cannot_like_same_post_twice(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        $this->actingAs($user)->postJson('/api/likes', ['post_id' => $post->id]);
        $response = $this->postJson('/api/likes', ['post_id' => $post->id]);

        $response->assertStatus(201);
        $this->assertDatabaseCount('likes', 1);
    }
}
