<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Auth\ForgotPasswordRequest;
use App\Http\Requests\V1\Auth\LoginRequest;
use App\Http\Requests\V1\Auth\RegisterRequest;
use App\Http\Requests\V1\Auth\ResetPasswordRequest;
use App\Http\Resources\V1\AuthResource;
use App\Http\Resources\V1\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register User
     *
     * @unauthenticated
     *
     * @param App\Http\Requests\RegisterRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(RegisterRequest $request): AuthResource | JsonResponse
    {
        try {
            return DB::transaction(function () use ($request) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'username' => $request->username,
                    'password' => Hash::make($request->password),
                ]);

                $user->sendEmailVerificationNotification();

                return AuthResource::make($user);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => __('auth.register_error'),
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Login User
     *
     * @unauthenticated
     *
     * @param App\Http\Requests\LoginRequest $request
     * @return \Illuminate\Http\JsonResponse | App\Http\Resources\AuthResource
     */
    public function login(LoginRequest $request): AuthResource | JsonResponse
    {

        $request->authenticate();

        $user = $request->user();

        return AuthResource::make($user);
    }


    /**
     * Logout User
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request): \Illuminate\Http\JsonResponse
    {
        // Revoke token
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => __('auth.logout')
        ]);
    }

    /**
     * Change Password
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request): \Illuminate\Http\JsonResponse
    {
        // Validate request
        $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        // check if current password is correct
        if (!Hash::check($request->current_password, $request->user()->password)) {

            throw ValidationException::withMessages([
                'current_password' => __('auth.failed')
            ]);
        }

        // Update password
        $user = User::find($request->user()->id);
        $user->password = Hash::make($request->password);
        $user->save();
        return response()->json([
            'message' => __('passwords.changed')
        ]);
    }

    /**
     * Get User
     *
     * @param Request $request
     * @return \App\Http\Resources\UserResource
     */
    public function profile(Request $request): UserResource
    {
        return UserResource::make($request->user());
    }

    /**
     * Verify Email
     *
     * @param App\Http\Requests\VerifyEmailRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyEmail(int $id, string $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        // Validate email hash
        if (! hash_equals(
            (string) $hash,
            sha1($user->getEmailForVerification())
        )) {
            return response()->json([
                'message' => __('auth.invalid_verification_link'),
            ], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => __('auth.email_already_verified'),
            ]);
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        return response()->json([
            'message' => __('auth.email_verified'),
        ]);
    }

    /**
     * Resend Verification Email
     *
     * @param App\Http\Requests\ResendVerificationRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resendVerificationEmail(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => __('auth.email_already_verified'),
            ]);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => __('auth.email_sent'),
        ]);
    }

    /**
     * Forgot Password
     *
     * @param App\Http\Requests\ForgotPasswordRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            $status = Password::sendResetLink(
                $request->only('email')
            );

            return $this->passwordResponse($status);
        } catch (\Exception $e) {
            return response()->json([
                'message' => __('passwords.unable_to_send_reset'),
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Reset Password
     *
     * @param App\Http\Requests\ResetPasswordRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        try {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function (User $user, string $password) {
                    // Update password
                    $user->forceFill([
                        'password' => Hash::make($password),
                    ])->save();

                    $user->tokens()->delete();

                    event(new PasswordReset($user));
                }
            );

            return $this->passwordResponse($status);
        } catch (\Exception $e) {
            return response()->json([
                'message' => __('passwords.unable_to_reset_password'),
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }


    protected function passwordResponse(string $status, array $messages = []): JsonResponse
    {
        $map = [
            Password::RESET_LINK_SENT => ['message' => $messages['sent'] ?? __('passwords.sent'), 'code' => 200],
            Password::PASSWORD_RESET => ['message' => $messages['reset'] ?? __('passwords.reset'), 'code' => 200],
            Password::INVALID_USER => ['message' => $messages['user'] ?? __('passwords.user'), 'code' => 404],
            Password::INVALID_TOKEN => ['message' => $messages['token'] ?? __('passwords.token'), 'code' => 400],
            Password::RESET_THROTTLED => ['message' => $messages['throttled'] ?? __('passwords.throttled'), 'code' => 429],
        ];

        $response = $map[$status] ?? ['message' => $messages['default'] ?? __('passwords.unable_to_reset_password'), 'code' => 500];

        return response()->json(['message' => $response['message']], $response['code']);
    }
}
