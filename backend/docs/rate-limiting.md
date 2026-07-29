# Rate Limiting

This project configures multiple rate limiters to protect API endpoints from abuse.

## Configuration

File: `app/Providers/AppServiceProvider.php`

```php
private function configureRateLimiting(): void
{
    // Default API rate limiter - 60 requests per minute
    RateLimiter::for('api', fn(Request $request) =>
        Limit::perMinute(60)->by($request->user()?->id ?: $request->ip())
    );

    // Auth endpoints - 5 requests per minute (brute force protection)
    RateLimiter::for('auth', fn(Request $request) =>
        Limit::perMinute(5)->by($request->ip())
    );

    // Authenticated user requests - 120 requests per minute
    RateLimiter::for('authenticated', fn(Request $request) =>
        $request->user()
            ? Limit::perMinute(120)->by($request->user()->id)
            : Limit::perMinute(60)->by($request->ip())
    );
}
```

## Rate Limiters

| Limiter | Limit | Key | Use Case |
|---|---|---|---|
| `api` | 60/min | User ID or IP | General API endpoints |
| `auth` | 5/min | IP | Login, register (brute force protection) |
| `authenticated` | 120/min | User ID | Authenticated endpoints |

## Applying Rate Limiters

### In Route Files

```php
// Auth endpoints - restrictive
Route::middleware('throttle:auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Protected endpoints - generous
Route::middleware(['auth:sanctum', 'throttle:authenticated'])->group(function () {
    Route::get('profile', [AuthController::class, 'profile']);
});

// Custom throttle
Route::get('search', fn() => ...)
    ->middleware('throttle:30,1'); // 30 requests per 1 minute
```

### In Controllers

```php
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;

public function index(Request $request)
{
    $rateLimit = RateLimiter::remaining('api', 60);

    if ($rateLimit < 1) {
        return response()->json(['message' => 'Too many requests'], 429);
    }

    // ...
}
```

## Rate Limit Response

When rate limit is exceeded, Laravel returns:

```json
{
    "message": "Too Many Attempts. Please try again in 60 seconds."
}
```

Status code: **429 Too Many Requests**

## Response Headers

Laravel automatically adds rate limit headers:

| Header | Description |
|---|---|
| `X-RateLimit-Limit` | Max requests allowed |
| `X-RateLimit-Remaining` | Requests remaining |
| `Retry-After` | Seconds until next request (on 429) |

## Custom Rate Limiters

### Per-Endpoint Limits

```php
// In AppServiceProvider
RateLimiter::for('search', fn(Request $request) =>
    Limit::perMinute(10)->by($request->user()?->id ?: $request->ip())
);

// In routes
Route::get('search', fn() => ...)->middleware('throttle:search');
```

### Daily Limits

```php
RateLimiter::for('exports', fn(Request $request) =>
    Limit::perDay(5)->by($request->user()->id)
);
```

### Custom Response

```php
use Illuminate\Http\Exceptions\ThrottleRequestsException;

RateLimiter::for('custom', function (Request $request) {
    return Limit::perMinute(10)->by($request->ip())->response(
        function (Request $request, array $headers) {
            throw new ThrottleRequestsException(
                'Custom rate limit message.',
                $headers,
                429
            );
        }
    );
});
```

## Testing Rate Limits

```php
public function test_auth_rate_limiting(): void
{
    // Make 5 requests (should pass)
    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/v1/login', [
            'login' => 'test@example.com',
            'password' => 'wrong',
        ]);
    }

    // 6th request should be rate limited
    $response = $this->postJson('/api/v1/login', [
        'login' => 'test@example.com',
        'password' => 'wrong',
    ]);

    $response->assertStatus(429);
}
```

## Redis for Rate Limiting

For production, use Redis as the cache driver for accurate rate limiting:

```env
CACHE_DRIVER=redis
```

Without Redis (using file/array cache), rate limits may not work accurately in multi-server setups.
