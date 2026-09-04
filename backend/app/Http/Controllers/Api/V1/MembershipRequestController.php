<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\MembershipRequestResource;
use App\Http\Traits\ApiResponse;
use App\Models\Invitation;
use App\Models\MembershipRequest;
use App\Models\Sacco;
use App\Models\User;
use App\Notifications\MembershipRequestApprovedNotification;
use App\Notifications\MembershipRequestRejectedNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

class MembershipRequestController extends Controller
{
    use ApiResponse;

    /**
     * Submit a public membership request for a SACCO.
     */
    public function publicStore(Request $request, Sacco $sacco): JsonResponse
    {
        // Public visibility & application acceptance checks
        if ($sacco->status !== 'approved' || ! $sacco->is_directory_allowed || ! $sacco->is_public) {
            return $this->error('This SACCO is not available for public membership requests.', 422);
        }

        if (! $sacco->is_accepting_members) {
            return $this->error('This SACCO is not currently accepting membership applications.', 422);
        }

        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone_number' => ['required', 'string', 'max:50'],
            'national_id' => ['nullable', 'string', 'max:50'],
            'message' => ['nullable', 'string', 'max:1000'],
        ]);

        // Prevent duplicate pending requests for the same email and SACCO
        $existingPending = MembershipRequest::query()
            ->where('sacco_id', $sacco->id)
            ->where('email', $validated['email'])
            ->where('status', 'pending')
            ->exists();

        if ($existingPending) {
            return $this->error('You already have a pending membership request for this SACCO.', 422);
        }

        // Check if email already belongs to a user in this SACCO
        $existingUser = User::query()
            ->where('sacco_id', $sacco->id)
            ->where('email', $validated['email'])
            ->exists();

        if ($existingUser) {
            return $this->error('An account with this email already exists in this SACCO.', 422);
        }

        $membershipRequest = MembershipRequest::create([
            'sacco_id' => $sacco->id,
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'national_id' => $validated['national_id'] ?? null,
            'message' => $validated['message'] ?? null,
            'status' => 'pending',
        ]);

        return $this->created(
            MembershipRequestResource::make($membershipRequest),
            'Membership request submitted successfully.'
        );
    }

    /**
     * List membership requests for the authenticated SACCO admin's tenant.
     */
    public function indexAdmin(Request $request): JsonResponse|AnonymousResourceCollection
    {
        $saccoId = $request->user()->sacco_id;
        if (! $saccoId) {
            return $this->forbidden('User is not associated with a SACCO.');
        }

        $query = MembershipRequest::query()
            ->where('sacco_id', $saccoId)
            ->with(['sacco', 'reviewer']);

        if ($request->filled('status') && in_array($request->query('status'), ['pending', 'approved', 'rejected'], true)) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where(function ($q) use ($search): void {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        $requests = $query->latest()->paginate(15);

        return MembershipRequestResource::collection($requests);
    }

    /**
     * View a single membership request for the authenticated SACCO admin's tenant.
     */
    public function showAdmin(Request $request, int $id): JsonResponse
    {
        $saccoId = $request->user()->sacco_id;
        if (! $saccoId) {
            return $this->forbidden('User is not associated with a SACCO.');
        }

        $membershipRequest = MembershipRequest::query()
            ->where('sacco_id', $saccoId)
            ->where('id', $id)
            ->with(['sacco', 'reviewer'])
            ->first();

        if (! $membershipRequest) {
            return $this->notFound('Membership request not found.');
        }

        return $this->success(
            MembershipRequestResource::make($membershipRequest),
            'Membership request retrieved successfully.'
        );
    }

    /**
     * Approve a pending membership request.
     */
    public function approve(Request $request, int $id): JsonResponse
    {
        $admin = $request->user();
        $saccoId = $admin->sacco_id;
        if (! $saccoId) {
            return $this->forbidden('User is not associated with a SACCO.');
        }

        return DB::transaction(function () use ($admin, $saccoId, $id): JsonResponse {
            $membershipRequest = MembershipRequest::query()
                ->where('sacco_id', $saccoId)
                ->where('id', $id)
                ->lockForUpdate()
                ->first();

            if (! $membershipRequest) {
                return $this->notFound('Membership request not found.');
            }

            if ($membershipRequest->status !== 'pending') {
                return $this->error("Cannot approve request. Current status is '{$membershipRequest->status}'.", 422);
            }

            $membershipRequest->update([
                'status' => 'approved',
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
            ]);

            // Create/Update invitation token
            $token = Str::random(60);
            Invitation::updateOrCreate(
                [
                    'sacco_id' => $saccoId,
                    'email' => $membershipRequest->email,
                ],
                [
                    'token' => $token,
                    'expires_at' => now()->addDays(7),
                    'accepted_at' => null,
                ]
            );

            $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
            $activationUrl = "{$frontendUrl}/member/accept-invite?token={$token}";

            // Send notification
            Notification::route('mail', $membershipRequest->email)
                ->notify(new MembershipRequestApprovedNotification($membershipRequest->load('sacco'), $activationUrl));

            return $this->success(
                MembershipRequestResource::make($membershipRequest->fresh(['sacco', 'reviewer'])),
                'Membership request approved successfully. Activation invitation email sent.'
            );
        });
    }

    /**
     * Reject a pending membership request.
     */
    public function reject(Request $request, int $id): JsonResponse
    {
        $admin = $request->user();
        $saccoId = $admin->sacco_id;
        if (! $saccoId) {
            return $this->forbidden('User is not associated with a SACCO.');
        }

        $validated = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:1000'],
        ]);

        return DB::transaction(function () use ($admin, $saccoId, $id, $validated): JsonResponse {
            $membershipRequest = MembershipRequest::query()
                ->where('sacco_id', $saccoId)
                ->where('id', $id)
                ->lockForUpdate()
                ->first();

            if (! $membershipRequest) {
                return $this->notFound('Membership request not found.');
            }

            if ($membershipRequest->status !== 'pending') {
                return $this->error("Cannot reject request. Current status is '{$membershipRequest->status}'.", 422);
            }

            $membershipRequest->update([
                'status' => 'rejected',
                'rejection_reason' => $validated['rejection_reason'],
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
            ]);

            // Send notification
            Notification::route('mail', $membershipRequest->email)
                ->notify(new MembershipRequestRejectedNotification($membershipRequest->load('sacco')));

            return $this->success(
                MembershipRequestResource::make($membershipRequest->fresh(['sacco', 'reviewer'])),
                'Membership request rejected successfully.'
            );
        });
    }
}
