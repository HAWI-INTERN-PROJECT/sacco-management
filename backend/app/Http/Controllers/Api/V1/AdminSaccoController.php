<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\SaccoResource;
use App\Http\Traits\ApiResponse;
use App\Models\Sacco;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminSaccoController extends Controller
{
    use ApiResponse;

    /**
     * List all SACCOs
     *
     * Returns a paginated list of all SACCOs on the platform.
     * Optionally filter by status (pending, approved, rejected).
     *
     * @param  Request  $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Sacco::withCount('users');

        // Filter by status if provided
        if ($request->has('status') && in_array($request->query('status'), ['pending', 'approved', 'rejected'])) {
            $query->where('status', $request->query('status'));
        }

        $saccos = $query->latest()->paginate(15);

        return SaccoResource::collection($saccos);
    }

    /**
     * Show a single SACCO
     *
     * Returns detailed information about a specific SACCO including its members.
     *
     * @param  Sacco  $sacco
     * @return SaccoResource
     */
    public function show(Sacco $sacco): SaccoResource
    {
        $sacco->loadCount('users');

        return SaccoResource::make($sacco);
    }

    /**
     * Approve a pending SACCO
     *
     * Changes the SACCO status from "pending" to "approved",
     * allowing its admin and members to fully operate on the platform.
     *
     * @param  Sacco  $sacco
     * @return JsonResponse
     */
    public function approve(Sacco $sacco): JsonResponse
    {
        if ($sacco->status !== 'pending') {
            return $this->error(
                "Cannot approve a SACCO that is currently '{$sacco->status}'. Only pending SACCOs can be approved.",
                422
            );
        }

        $sacco->update(['status' => 'approved']);

        return $this->success(
            SaccoResource::make($sacco->loadCount('users')),
            'SACCO has been approved successfully.'
        );
    }

    /**
     * Reject a pending SACCO
     *
     * Changes the SACCO status from "pending" to "rejected".
     *
     * @param  Sacco  $sacco
     * @return JsonResponse
     */
    public function reject(Sacco $sacco): JsonResponse
    {
        if ($sacco->status !== 'pending') {
            return $this->error(
                "Cannot reject a SACCO that is currently '{$sacco->status}'. Only pending SACCOs can be rejected.",
                422
            );
        }

        $sacco->update(['status' => 'rejected']);

        return $this->success(
            SaccoResource::make($sacco->loadCount('users')),
            'SACCO has been rejected.'
        );
    }
}
