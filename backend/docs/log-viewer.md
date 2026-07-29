# Log Viewer (opcodesio/log-viewer)

Web-based log viewer for browsing, searching, and downloading log files.

## Setup

```bash
cd Backend
composer install
php artisan log-viewer:publish
```

## Access

```
http://your-app.com/logs
```

## Features

- **File Browser** — Browse all log files in `storage/logs/`
- **Search** — Full-text search across log entries
- **Filter** — Filter by log level (error, warning, info, debug)
- **Download** — Download individual log files
- **Delete** — Remove old log files
- **Dark/Light Theme** — Toggle between themes

## Log Levels

| Level | Color | Description |
|---|---|---|
| `debug` | Gray | Debug messages |
| `info` | Blue | Informational messages |
| `notice` | Cyan | Normal but significant |
| `warning` | Yellow | Warning messages |
| `error` | Red | Error messages |
| `critical` | Purple | Critical conditions |
| `alert` | Orange | Action required |
| `emergency` | Black | System is unusable |

## Configuration

In `config/log-viewer.php`:

```php
return [
    'route_path' => 'logs',        // URL path
    'middleware' => [],              // Add 'auth' to protect
    'theme' => 'auto',              // light, dark, auto
    'per_page' => 25,               // Entries per page
    'date_format' => 'Y-m-d H:i:s',
    'scan_path' => storage_path('logs'),
    'file_pattern' => '*.log',
];
```

## Protect with Authentication

```php
'middleware' => ['auth', 'web'],
```

## API Routes (if needed)

```php
// Get all log files
GET /api/logs

// Get specific log file
GET /api/logs/{filename}

// Download log file
GET /api/logs/{filename}/download

// Delete log file
DELETE /api/logs/{filename}
```

## Troubleshooting

| Issue | Solution |
|---|---|
| 404 on /logs | Run `php artisan log-viewer:publish` |
| No logs showing | Check `storage/logs/` has `.log` files |
| Permission denied | `chmod -R 775 storage/logs` |
