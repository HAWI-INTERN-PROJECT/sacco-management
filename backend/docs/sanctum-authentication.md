# Sanctum Authentication

This project uses [`laravel/sanctum`](https://laravel.com/docs/sanctum) for API token-based authentication.

## How It Works

Sanctum provides two authentication methods:
1. **SPA Authentication** - Cookie-based auth for first-party SPAs
2. **API Token Authentication** - Token-based auth for mobile apps, third-party integrations, etc.

This project uses **API Token Authentication** with Personal Access Tokens.

## Configuration

File: `config/sanctum.php`

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    Sanctum::currentApplicationUrlWithPort(),
))),

'guard' => ['web'],

'expiration' => null,  // Tokens never expire by default
```

## Setup

### 1. Install Sanctum

Already installed in this project:
```bash
composer require laravel/sanctum
```

### 2. Run Migrations

```bash
php artisan migrate
```

This creates the `personal_access_tokens` table.

### 3. Add `HasApiTokens` to User Model

Already configured in `app/Models/User.php`:

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

## Authentication Flow

### Register

```bash
POST /api/v1/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "password_confirmation": "password123",
    "remember_me": false
}
```

Response:
```json
{
    "user": { "id": 1, "name": "John Doe", ... },
    "access_token": "1|abc123...",
    "token_type": "Bearer",
    "expires_at": "2026-07-25 00:00:00"
}
```

### Login

```bash
POST /api/v1/login
Content-Type: application/json

{
    "login": "john@example.com",  // email or username
    "password": "password123",
    "remember_me": false
}
```

Response (same format as register).

**Token Expiration:**
- `remember_me: false` → expires in **1 day**
- `remember_me: true` → expires in **6 months**

### Authenticated Requests

Include the token in the `Authorization` header:

```bash
GET /api/v1/profile
Authorization: Bearer 1|abc123...
```

### Logout

```bash
POST /api/v1/logout
Authorization: Bearer 1|abc123...
```

Revokes the current access token.

### Health Check

```bash
GET /api/v1/health
```

No authentication required. Returns:

```json
{
    "status": "healthy",
    "timestamp": "2026-07-24 00:00:00"
}
```

## Protecting Routes

### Middleware

```php
// Single route
Route::get('/profile', fn() => auth()->user())
    ->middleware('auth:sanctum');

// Route group
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
```

### In Controllers

```php
public function profile(Request $request): UserResource
{
    return UserResource::make($request->user());
}
```

## Token Management

### Create Token

```php
$token = $user->createToken('token-name');
$plainTextToken = $token->plainTextToken;
```

### Revoke Token

```php
// Revoke current token
$request->user()->currentAccessToken()->delete();

// Revoke all tokens
$request->user()->tokens()->delete();
```

### Check Scopes

```php
if ($user->tokenCan('server:manage')) {
    // ...
}
```

## Rate Limiting

Authenticated routes use the `authenticated` rate limiter (120 req/min):

```php
Route::middleware(['auth:sanctum', 'throttle:authenticated'])->group(function () {
    // ...
});
```

See [Rate Limiting](./rate-limiting.md) for details.

## Debugging

```bash
# List all personal access tokens
php artisan tinker
>>> App\Models\User::find(1)->tokens;

# Check token expiry
>>> App\Models\PersonalAccessToken::all();
```
