<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponse;

    /**
     * Get dashboard statistics for the authenticated admin's SACCO.
     */
    public function index(Request $request): JsonResponse
    {
        $saccoId = $request->user()->sacco_id;

        $totalMembers = User::where('sacco_id', $saccoId)
            ->where('role', 'member')
            ->count();

        return $this->success(
            [
                'total_members' => $totalMembers,
            ],
            'Dashboard statistics retrieved successfully.'
        );
    }
}