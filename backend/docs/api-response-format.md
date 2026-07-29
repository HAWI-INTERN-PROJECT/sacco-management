# API Response Format

All API responses follow a consistent JSON format using the `ApiResponse` trait.

## Response Structure

### Success Response

```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }
}
```

## Usage in Controllers

Add the trait to your controller:

```php
use App\Http\Traits\ApiResponse;

class YourController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $data = Model::all();
        return $this->success($data, 'Retrieved successfully');
    }

    public function store(Request $request)
    {
        $model = Model::create($request->validated());
        return $this->created($model, 'Created successfully');
    }

    public function destroy($id)
    {
        Model::find($id)->delete();
        return $this->deleted('Deleted successfully');
    }
}
```

## Available Methods

| Method | Status Code | Description |
|---|---|---|
| `success($data, $message, $code)` | 200 | Generic success |
| `created($data, $message)` | 201 | Resource created |
| `deleted($message)` | 200 | Resource deleted |
| `error($message, $code, $errors)` | 400+ | Generic error |
| `notFound($message)` | 404 | Resource not found |
| `unauthorized($message)` | 401 | Unauthorized |
| `forbidden($message)` | 403 | Forbidden |
| `validated($message, $errors)` | 422 | Validation failed |
| `throttled($message)` | 429 | Rate limited |

## Examples

### Success with Data

```php
return $this->success($user, 'User retrieved');
```

```json
{
  "success": true,
  "message": "User retrieved",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Validation Error

```php
return $this->validated('Validation failed', $errors);
```

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### Not Found

```php
return $this->notFound('User not found');
```

```json
{
  "success": false,
  "message": "User not found"
}
```

## API Resources

Resources extend `ApiResponseResource` to auto-wrap responses:

```php
class UserResource extends ApiResponseResource
{
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
```

Response:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "John Doe"
  }
}
```
