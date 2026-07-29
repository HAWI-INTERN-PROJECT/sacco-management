<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\NewAccessToken;

class AuthResource extends ApiResponseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $this->resource;
        $remember = request()->boolean('remember_me');

        // Create a personal access token
        $newToken = $user->createToken('Personal Access Token');
        // Set token expiration
        $this->setTokenExpiration($newToken, $remember);

        return [
            'user' => UserResource::make($this->resource),
            'access_token' => $newToken->plainTextToken,
            'token_type' => 'Bearer',
            'expires_at' => $newToken->accessToken->expires_at->toDateTimeString(),

        ];
    }

    protected function setTokenExpiration(NewAccessToken $newToken, bool $rememberMe = false): void
    {
        $expires = $rememberMe
            ? Carbon::now()->addMonths(6)
            : Carbon::now()->addDay();

        $token = $newToken->accessToken;
        $token->expires_at = $expires;
        $token->save();
    }
}
