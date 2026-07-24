# Inventory Management System

This is an inventory management system built with the Laravel framework. It provides a robust platform for managing inventory, products, and transactions.

## Table of Contents

- [Development with Docker](#development-with-docker)
  - [Prerequisites for Docker](#prerequisites-for-docker)
  - [Installation and Running with Docker](#installation-and-running-with-docker)
  - [Available Services](#available-services)
- [Local Development (Without Docker)](#local-development-without-docker)
  - [Prerequisites for Local Development](#prerequisites-for-local-development)
  - [Installation](#local-installation)
  - [Running the Application](#running-the-application-locally)
- [Coding Conventions](#coding-conventions)
- [Branch Naming Guidelines](#branch-naming-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Contributing](#contributing)
- [FAQ](#faq)

## Development with Docker

This is the recommended way to run the project for development.

### Prerequisites for Docker

- **Docker**
- **Docker Compose**

### Installation and Running with Docker

1.  **Clone the repository:**
    ```bash
    git clone https://github.com:kalidyasin/laravel-api-kit.git
    cd laravel-api-kit
    ```

2.  **Create Environment File And Create compose override:**
    Copy the example environment file. The default values are configured for Docker.
    Copy the example compose override file. and modify it according to your needs.
    ```bash
    cp .env.example .env
    cp compose.override.yaml.example compose.override.yaml
    ```

3.  **Build and Run the Application:**
    ```bash
    docker compose up -d --build
    ```
    The application will be available at `http://localhost`.

4.  **Install PHP Dependencies:**
    ```bash
    docker compose run --rm composer install
    ```

5.  **Install Frontend Dependencies:**
    ```bash
    docker compose run --rm npm install
    ```

6.  **Generate Application Key:**
    ```bash
    docker compose run --rm artisan key:generate
    ```

7.  **Run Database Migrations:**
    ```bash
    docker compose run --rm artisan migrate
    ```

8.  **(Optional) Seed the Database:**
    ```bash
    docker compose run --rm artisan db:seed
    ```


### Available Services

The `compose.override.yaml` file defines the following services:

| Service    | Port(s)         | Description                               |
|------------|-----------------|-------------------------------------------|
| `app`      | `80:80`         | Nginx web server                          |
| `mysql`    | `3306:3306`     | MySQL database server                     |
| `postgres` | `5432:5432`     | PostgreSQL database server                |
| `php`      | `9000:9000`     | PHP-FPM service                           |
| `redis`    | `6379:6379`     | Redis server                              |
| `composer` | -               | Service to run Composer commands          |
| `npm`      | `5173:5173`     | Service to run NPM commands (Vite)        |
| `artisan`  | -               | Service to run Artisan commands           |
| `mailpit`  | `8025:8025`     | Email testing tool (web interface)        |
| `adminer`  | `8080:8080`     | Database management tool (web interface)  |

- **Application**: [http://localhost](http://localhost)
- **Mailpit**: [http://localhost:8025](http://localhost:8025)
- **Adminer**: [http://localhost:8080](http://localhost:8080)


## Local Development (Without Docker)

### Prerequisites for Local Development

- **PHP >= 8.2**
- **Composer**
- **Node.js & NPM**
- **A database server** (e.g., MySQL, PostgreSQL, SQLite)

### Local Installation

Follow these steps to get your development environment set up:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Hawi-Software-Solutions/E-Student-Backend.git
    cd E-Student-Backend
    ```

2.  **Install PHP Dependencies:**
    ```bash
    composer install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

4.  **Create Environment File:**
    Copy the example environment file and customize it for your local setup.
    ```bash
    cp .env.example .env
    ```

5.  **Generate Application Key:**
    This key is used for encryption and is essential for your application to run securely.
    ```bash
    php artisan key:generate
    ```

6.  **Configure Your `.env` File:**
    Open the `.env` file and set up your database connection details (`DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).

7.  **Run Database Migrations:**
    This will create all the necessary tables in your database.
    ```bash
    php artisan migrate
    ```

8.  **(Optional) Seed the Database:**
    If you want to populate your database with initial data, run the seeders.
    ```bash
    php artisan db:seed
    ```

### Running the Application Locally

To run the application, you need to start both the Laravel development server and the Vite server for frontend assets.

1.  **Start the Laravel Server:**
    ```bash
    php artisan serve
    ```
    Your application will be available at `http://127.0.0.1:8000`.

2.  **Start the Vite Server:**
    Open a new terminal window and run the following command to compile frontend assets and enable hot-reloading.
    ```bash
    npm run dev
    ```

## Coding Conventions

To maintain consistency and readability across the codebase, please adhere to the following conventions.

### 1. Naming Conventions

-   **Variables**: `camelCase`
    -   *Example*: `$studentList`, `$totalFees`

-   **Functions & Methods**: `camelCase`
    -   *Example*: `function calculateTotalScore()`, `public function getUserProfile()`

-   **Classes**: `PascalCase` (or `StudlyCaps`)
    -   *Example*: `class StudentController`, `class FeePaymentService`

-   **Route URIs**: `kebab-case`
    -   *Example*: `Route::get('/user/profile-picture', ...);`
    -   *Example*: `Route::post('/student-admissions', ...);`

-   **Migrations**: `snake_case` (plural)
    -   *Example*: `create_students_table.php`, `create_academic_years_table.php`

-   **Database Tables**: `snake_case` (plural)
    -   *Example*: `students`, `academic_years`
    **Note**: Pivot tables `snake_case` (singular) in alphabetical order are used to store many-to-many relationships between tables.
    -   *Example*: `role_user`, `campus_user`

-   **Database Columns**: `snake_case`
    -   *Example*: `first_name`, `is_active`, `student_id`

-   **Files**: `PascalCase` for classes, `snake_case` for other files.
    -   *Example*: `StudentController.php`, `api_routes.php`

### 2. General Guidelines

-   **Indentation**: Use 4 spaces for indentation, not tabs.
-   **Line Endings**: Use Unix-style line endings (LF).
-   **Comments**: Add comments to explain complex logic. Do not comment on obvious code.
-   **Single Responsibility**: Each class and method should have a single, well-defined responsibility.


### Branch Naming Guidelines

Use descriptive and meaningful branch names that reflect the purpose or feature being worked on.

### Branch Naming Conventions

Use the following conventions for branch names:
- `fix/bug_name`: For bug fixes.
- `hotfix/bug_name`: For urgent bug fixes.
- `feature/feature_name` or `feat/feature_name`: For new features.
- `refactor/refactor_name`: For refactoring existing code.
- `chore/name`: For maintenance tasks (e.g., dependency updates, code formatting ...).
- `docs/name`: For documentation updates.
- `release/version_name`: For releases (e.g., v1.0.0).

### Commit Message Guidelines

Write clear and descriptive commit messages that explain the changes made in each commit.

### Commit Message Conventions

Use the following conventions for commit messages:
- `fix: bug name`: For bug fixes.
- `hotfix: bug name`: For urgent bug fixes.
- `feature: feature name` or `feat: feature name`: For new features.
- `chore: name`: For maintenance tasks.
- `refactor: name`: For refactoring existing code.
- `docs: name`: For documentation updates.

### Pull Request Guidelines

- Provide a clear and concise description of the changes.
- Include screenshots or examples if applicable.
- Ensure all tests pass before submitting.
- Request reviews from relevant team members.

### Contributing

We welcome contributions from everyone! Here’s how you can get started:
1. **Fork the Repository**: Create your own fork of the project.
2. **Create a Branch**: Follow the branch naming conventions (e.g., `feature/your-feature`).
3. **Make Your Changes**: Adhere to the coding conventions and commit message guidelines.
4. **Submit a Pull Request**: Follow the pull request guidelines.
5. **Wait for Review**: Your PR will be reviewed by the maintainers.

---
## FAQ

### Common Issues and Solutions
- **Issue**: Docker containers fail to start.
  - **Solution**: Ensure Docker Desktop is running and your `.env` file is correctly configured.
- **Issue**: Composer dependencies fail to install.
  - **Solution**: Run `docker compose run --rm composer install` again and check for errors.
- **Issue**: Database migrations fail.
  - **Solution**: Verify your database credentials in `.env` and ensure the database service is running.
