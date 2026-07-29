# Testing with PHPUnit

This project uses **PHPUnit 11** for testing with Laravel's built-in test utilities.

## Setup

PHPUnit is configured in `phpunit.xml` with in-memory SQLite for tests:

```xml
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

## Running Tests

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature

# Run specific test file
php artisan test tests/Feature/AuthTest.php

# Run specific test method
php artisan test --filter=test_user_can_register

# Run with coverage
php artisan test --coverage

# Clear config before running
composer test
```

## Test Structure

```
tests/
├── TestCase.php                   # Base test class
├── Feature/
│   ├── AuthTest.php               # Auth endpoint tests (15 tests)
│   ├── ChangePasswordTest.php     # Password change tests (7 tests)
│   ├── EmailVerificationTest.php  # Email verification tests (6 tests)
│   ├── PasswordResetTest.php      # Password reset tests (8 tests)
│   └── RateLimitingTest.php       # Rate limiting tests (5 tests)
└── Unit/
    └── UserTest.php               # User model tests (9 tests)
```

**Total: 50 tests**

## Writing Tests

### Unit Tests

Tests that don't interact with the database:

```php
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ExampleTest extends TestCase
{
    public function test_true_is_true(): void
    {
        $this->assertTrue(true);
    }
}
```

### Feature Tests

Tests that interact with routes, models, and database:

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/v1/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'username' => 'johndoe',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email', 'username'],
                'access_token',
                'token_type',
                'expires_at',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'username' => 'johndoe',
        ]);
    }

    public function test_user_can_login_with_email(): void
    {
        User::factory()->create([
            'email' => 'john@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'login' => 'john@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['access_token']);
    }

    public function test_authenticated_user_can_get_profile(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->getJson('/api/v1/profile');

        $response->assertOk()
            ->assertJsonFragment(['email' => $user->email]);
    }
}
```

### Available Auth Tests

```bash
php artisan test --filter=AuthTest
```

| Test | Description |
|---|---|
| `test_user_can_register` | Register returns user + token |
| `test_register_requires_name` | Name validation |
| `test_register_requires_valid_email` | Email format validation |
| `test_register_requires_unique_email` | Email uniqueness |
| `test_register_requires_unique_username` | Username uniqueness |
| `test_register_requires_password_confirmation` | Password confirmation |
| `test_user_can_login_with_email` | Login with email |
| `test_user_can_login_with_username` | Login with username |
| `test_login_fails_with_wrong_password` | Wrong password rejected |
| `test_login_fails_with_nonexistent_user` | Unknown user rejected |
| `test_login_requires_login_field` | Login field required |
| `test_authenticated_user_can_get_profile` | Profile with auth |
| `test_unauthenticated_user_cannot_get_profile` | Profile without auth |
| `test_authenticated_user_can_logout` | Logout revokes token |
| `test_health_check_returns_healthy` | Health endpoint |

### Change Password Tests

```bash
php artisan test --filter=ChangePasswordTest
```

| Test | Description |
|---|---|
| `test_user_can_change_password` | Password change success |
| `test_change_password_requires_current_password` | Current password required |
| `test_change_password_requires_new_password` | New password required |
| `test_change_password_requires_confirmation` | Confirmation required |
| `test_change_password_fails_with_wrong_current` | Wrong current password |
| `test_change_password_fails_with_short_password` | Min 8 chars |
| `test_unauthenticated_user_cannot_change_password` | Auth required |

### Email Verification Tests

```bash
php artisan test --filter=EmailVerificationTest
```

| Test | Description |
|---|---|
| `test_email_can_be_verified` | Verify email success |
| `test_email_can_not_be_verified_with_invalid_hash` | Invalid hash rejected |
| `test_email_can_be_verified_with_valid_hash` | Valid hash works |
| `test_email_verification_requires_user_id` | User ID required |
| `test_email_verification_requires_hash` | Hash required |
| `test_unauthenticated_user_cannot_resend_verification` | Auth required |

### Password Reset Tests

```bash
php artisan test --filter=PasswordResetTest
```

| Test | Description |
|---|---|
| `test_forgot_password_sends_email` | Reset email sent |
| `test_forgot_password_returns_200_for_nonexistent_email` | No email leak |
| `test_forgot_password_requires_email` | Email required |
| `test_reset_password_requires_token` | Token required |
| `test_reset_password_requires_password` | Password required |
| `test_reset_password_requires_confirmation` | Confirmation required |
| `test_reset_password_with_valid_token` | Reset success |
| `test_reset_password_with_invalid_token` | Invalid token rejected |

### Rate Limiting Tests

```bash
php artisan test --filter=RateLimitingTest
```

| Test | Description |
|---|---|
| `test_login_is_rate_limited` | Login throttle |
| `test_register_is_rate_limited` | Register throttle |
| `test_forgot_password_is_rate_limited` | Reset throttle |
| `test_profile_is_rate_limited` | API throttle |
| `test_health_check_is_not_rate_limited` | Health unthrottled |

### User Model Unit Tests

```bash
php artisan test --filter=UserTest
```

| Test | Description |
|---|---|
| `test_user_has_fillable_attributes` | Mass assignable |
| `test_user_has_hidden_attributes` | Hidden fields |
| `test_user_has_casts` | Type casting |
| `test_user_password_is_hashed` | Auto hashing |
| `test_user_can_create_access_token` | Sanctum tokens |
| `test_user_factory_creates_valid_user` | Factory works |
| `test_user_factory_state_verified` | Verified state |
| `test_user_belongs_to_many_roles` | Role relationship |
| `test_user_has_orders` | Order relationship |

### Testing with Authentication

```php
// Using actingAs
$user = User::factory()->create();
$response = $this->actingAs($user)->get('/api/v1/profile');

// Using token
$token = $user->createToken('test-token')->plainTextToken;
$response = $this->withHeader('Authorization', "Bearer $token")
    ->get('/api/v1/profile');
```

### Testing Validation

```php
public function test_register_requires_name(): void
{
    $response = $this->postJson('/api/v1/register', [
        'email' => 'john@example.com',
        'username' => 'johndoe',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
}
```

### Model Factories

Create test data with factories:

```php
// database/factories/UserFactory.php
public function definition(): array
{
    return [
        'name' => fake()->name(),
        'email' => fake()->unique()->safeEmail(),
        'username' => fake()->unique()->userName(),
        'password' => bcrypt('password'),
    ];
}

// Usage in tests
$user = User::factory()->create();
$users = User::factory()->count(5)->create();
```

## Common Assertions

| Assertion | Description |
|---|---|
| `assertStatus(200)` | Check HTTP status code |
| `assertOk()` | Assert 200 status |
| `assertCreated()` | Assert 201 status |
| `assertUnprocessable()` | Assert 422 status |
| `assertJsonFragment([...])` | Check JSON contains values |
| `assertJsonStructure([...])` | Check JSON has structure |
| `assertDatabaseHas(...)` | Check database record exists |
| `assertDatabaseMissing(...)` | Check database record missing |
| `assertJsonValidationErrors([...])` | Check validation errors |

## CI Integration

Backend tests run in GitHub Actions with matrix testing:

```yaml
# .github/workflows/ci.yml
jobs:
  backend-test:
    name: Backend Test (PHP ${{ matrix.php }} - ${{ matrix.db }})
    runs-on: ubuntu-latest
    strategy:
      matrix:
        php: ['8.2', '8.3', '8.4']
        db: ['sqlite', 'mysql', 'postgresql']
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ matrix.php }}
      - run: composer install
      - run: php artisan test
```

### Running All Tests

```bash
# Run all 50 tests
php artisan test

# Run by suite
php artisan test --testsuite=Unit      # 9 tests
php artisan test --testsuite=Feature   # 41 tests

# Run by class
php artisan test --filter=AuthTest                # 15 tests
php artisan test --filter=ChangePasswordTest      # 7 tests
php artisan test --filter=EmailVerificationTest   # 6 tests
php artisan test --filter=PasswordResetTest       # 8 tests
php artisan test --filter=RateLimitingTest        # 5 tests
php artisan test --filter=UserTest                # 9 tests
```
