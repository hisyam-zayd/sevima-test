<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_post(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/posts', [
            'content' => 'Tes konten untuk post',
        ]);

        $response->assertStatus(201)->assertJson(['content' => 'Tes konten untuk post']);
    }

    public function test_user_can_create_post_with_image(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $gifContent = base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        $file = UploadedFile::fake()->createWithContent('test.gif', $gifContent);

        $response = $this->actingAs($user)->postJson('/api/posts', [
            'content' => 'Tes post dengan gambar',
            'image' => $file,
        ]);

        $response->assertStatus(201);
        Storage::disk('public')->assertExists('posts/' . $file->hashName());
    }

    public function test_user_can_get_all_posts(): void
    {
        $user = User::factory()->create();
        Post::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->getJson('/api/posts');

        $response->assertStatus(200)->assertJsonCount(3);
    }

    public function test_user_can_update_own_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->putJson("/api/posts/{$post->id}", [
            'content' => 'Updated content',
        ]);

        $response->assertStatus(200)->assertJson(['content' => 'Updated content']);
    }

    public function test_user_cannot_update_other_post(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->putJson("/api/posts/{$post->id}", [
            'content' => 'try to hiject other user content',
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_own_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->deleteJson("/api/posts/{$post->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }
}
