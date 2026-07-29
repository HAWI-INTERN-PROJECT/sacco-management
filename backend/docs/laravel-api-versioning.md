# API Versioning with `grazulex/laravel-apiroute`

This project uses [`grazulex/laravel-apiroute`](https://github.com/GrazulexLabs/laravel-apiroute) for API version management.

## How It Works

The package detects the API version from incoming requests using a configurable strategy and routes them to the correct versioned route file.

## Configuration

File: `config/apiroute.php`

### Detection Strategies

| Strategy | How it works | Example URL |
|---|---|---|
| `uri` (default) | Version in the URL path | `/api/v1/users` |
| `header` | Version in a request header | `X-API-Version: 1` |
| `query` | Version as a query parameter | `?api_version=1` |
| `accept` | Version in Accept header | `Accept: application/vnd.api.v1+json` |

The project uses **`uri`** strategy by default.

### Version Definitions

```php
// config/apiroute.php
'versions' => [
    'v1' => [
        'routes' => base_path('routes/api/v1.php'),
        'middleware' => [],
        'status' => 'active',
    ],
],
```

### Adding a New API Version

1. Create a new route file at `routes/api/v2.php`:

```php
<?php
declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::get('users', fn() => response()->json(['message' => 'V2 users endpoint']));
```

2. Register the version in `config/apiroute.php`:

```php
'versions' => [
    'v1' => [
        'routes' => base_path('routes/api/v1.php'),
        'middleware' => [],
        'status' => 'deprecated',
        'successor' => 'v2',
    ],
    'v2' => [
        'routes' => base_path('routes/api/v2.php'),
        'middleware' => [],
        'status' => 'active',
    ],
],
```

### Version Statuses

| Status | Behavior |
|---|---|
| `active` | Version is fully supported |
| `beta` | Version is in testing, may change |
| `deprecated` | Version still works but will be removed |
| `sunset` | Version returns 410 Gone (configurable) |

### Fallback Behavior

When a route doesn't exist in the requested version, it can fall back to a previous version:

```php
'fallback' => [
    'enabled' => true,
    'strategy' => 'previous',  // 'previous', 'latest', 'none'
    'add_header' => true,       // Adds X-API-Version-Fallback header
],
```

## Usage

### Define Versioned Routes

Routes go in version-specific files under `routes/`:

```
routes/
├── api.php         # Base routes (not versioned)
└── api/
    └── v1.php      # V1 routes
```

### Route Naming Convention

```php
// routes/api/v1.php
Route::get('health', fn() => response()->json(['status' => 'healthy']))
    ->name('api.v1.health');

Route::post('register', [AuthController::class, 'register'])->name('api.v1.register');
Route::post('login', [AuthController::class, 'login'])->name('api.v1.login');
```

### Versioned Controllers

Controllers live in versioned namespaces:

```
app/Http/Controllers/Api/V1/AuthController.php
```

### Versioned Form Requests

```
app/Http/Requests/V1/Auth/RegisterRequest.php
```

### Versioned Resources

```
app/Http/Resources/V1/UserResource.php
app/Http/Resources/V1/AuthResource.php
```

## Response Headers

The package automatically adds version-related headers to responses:

| Header | Description |
|---|---|
| `X-API-Version` | Current API version |
| `X-API-Version-Status` | Status of the version |
| `Deprecation` | RFC 8594 deprecation header |
| `Sunset` | RFC 7231 sunset date |
| `Link` | Successor version URL |

## Rate Limiting Per Version

You can set rate limits per version in the config:

```php
'v1' => [
    'rate_limit' => 60,  // requests per minute
],
```

## Testing

```bash
# Test V1 endpoint
curl http://localhost:8000/api/v1/login

# Test with version header (if using header strategy)
curl -H "X-API-Version: 1" http://localhost:8000/api/login
```
