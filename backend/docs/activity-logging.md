# Activity Logging

User activity is logged to files using Laravel's log channels.

## Log Location

Logs are stored in `storage/logs/activity.log`

## Log Format

```json
{
  "message": "User login",
  "action": "login",
  "user_id": 1,
  "ip": "127.0.0.1",
  "user_agent": "Mozilla/5.0...",
  "timestamp": "2025-07-24T12:00:00+03:00"
}
```

## Logged Actions

| Action | Description |
|---|---|
| `register` | User registered |
| `login` | User logged in |
| `logout` | User logged out |
| `password_changed` | Password changed |
| `password_reset` | Password reset via email |
| `email_verified` | Email verified |

## Usage in Code

```php
use App\Services\ActivityLogger;

// Log authentication events
ActivityLogger::login($request);
ActivityLogger::logout($request);
ActivityLogger::register($request);

// Log password changes
ActivityLogger::passwordChanged($request);
ActivityLogger::passwordReset($request);

// Log custom events
ActivityLogger::log('order_created', 'New order placed', $request, [
    'order_id' => $order->id,
    'total' => $order->total,
]);
```

## Configuration

Channel defined in `config/logging.php`:

```php
'activity' => [
    'driver' => 'daily',
    'path' => storage_path('logs/activity.log'),
    'level' => 'info',
    'days' => 30,  // Keep 30 days of logs
],
```

## Viewing Logs

### Via Log Viewer (Recommended)

Access the web UI at `/logs` (powered by opcodesio/log-viewer).

### Via Command Line

```bash
# Watch logs in real-time
php artisan pail --filter=activity

# View recent logs
tail -f storage/logs/activity.log

# Search by user
grep '"user_id":1' storage/logs/activity.log

# Search by action
grep '"action":"login"' storage/logs/activity.log
```

### Via Log Rotation

Logs are automatically rotated daily. After 30 days, old logs are deleted.

## Log File Naming

```
storage/logs/
├── activity-2025-07-24.log   # Today's activity
├── activity-2025-07-23.log   # Yesterday
├── laravel-2025-07-24.log    # App errors
└── ...
```
