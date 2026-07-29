# API Documentation with Dedoc Scramble

This project uses [`dedoc/scramble`](https://scramble.dedoc.co/) to auto-generate OpenAPI 3.1 documentation from your Laravel code.

## How It Works

Scramble automatically scans your routes, controllers, form requests, and resources to generate API documentation without writing any annotations or extra configuration.

## Setup

Already installed:
```bash
composer require dedoc/scramble
```

## Accessing the Documentation

Once installed, visit:

```
http://localhost:8000/docs/api
```

This shows the interactive Swagger UI where you can browse and test all API endpoints.

## How Scramble Generates Docs

### Routes

Scramble reads your route definitions and HTTP method:

```php
// Automatically documented as POST /api/v1/register
Route::post('register', [AuthController::class, 'register']);
```

### Form Requests

Validation rules are converted to OpenAPI schema:

```php
// RegisterRequest.php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'string', 'email', 'unique:users'],
        'password' => ['required', 'string', 'min:8', 'confirmed'],
    ];
}
```

Becomes OpenAPI schema with types, required fields, and constraints.

### Resources

Resource classes define response schemas:

```php
// UserResource.php
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'email' => $this->email,
    ];
}
```

### Controller PHPDoc

Use `@unauthenticated` to mark public endpoints:

```php
/**
 * Register User
 *
 * @unauthenticated
 */
public function register(RegisterRequest $request): AuthResource|JsonResponse
{
    // ...
}
```

## Customizing Documentation

### Add Tags

Group endpoints by adding tags in your route file:

```php
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::apiResource('users', UserController::class)
        ->only(['index', 'show', 'update', 'destroy']);
})->middleware('throttle:authenticated');
```

### Exclude Routes

To hide routes from documentation:

```php
Route::get('/health', fn() => 'ok')
    ->withoutMiddleware([\Dedoc\Scramble\Support\Generator\Scramble::class]);
```

Or in `config/scramble.php`:

```php
'paths' => [
    /*
    |--------------------------------------------------------------------------
    | API Path Patterns to Exclude
    |--------------------------------------------------------------------------
    */
    'exclude' => [
        'api/internal.*',
    ],
],
```

## Configuration

File: `config/scramble.php`:

```php
return [
    'paths' => [
        'api' => 'api',
    ],
    'paths_regex' => [
        'exclude' => [],
    ],
    'info' => [
        'title' => env('SCRAMBLE_TITLE', config('app.name') . ' API'),
        'version' => '1.0.0',
        'description' => 'REST API for the SACCO Management System.',
    ],
    'servers' => null,
    'extensions' => [],
    'export' => [
        'path' => storage_path('api-docs'),
        'filename' => 'api-docs',
    ],
];
```

## OpenAPI Export

### Via Browser

Visit `/docs/api` and click the download button.

### Via Command

```bash
php artisan scramble:export --format=json > api-docs.json
php artisan scramble:export --format=yaml > api-docs.yaml
```

## Testing the API

The Swagger UI at `/docs/api` has a "Try it out" button for each endpoint. You can:

1. Click **Authorize** and enter your Bearer token
2. Click **Try it out** on any endpoint
3. Fill in request body and parameters
4. Click **Execute** to see the response

## IDE Integration

### VS Code

Install the **OpenAPI (Swagger) Editor** extension for linting and previewing your generated docs.

### Postman

Import the generated OpenAPI JSON:
1. Open Postman
2. Click **Import** → **Link**
3. Enter `http://localhost:8000/docs/api?format=json`
