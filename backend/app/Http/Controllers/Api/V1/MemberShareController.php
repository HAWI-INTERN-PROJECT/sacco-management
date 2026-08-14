<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\UpdateMemberSharesRequest;
use App\Http\Resources\V1\UserResource;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class MemberShareController extends Controller
{
    use ApiResponse;

    /**
     * Update a member's share count.
     *
     * @param  UpdateMemberSharesRequest  $request
     * @param  User  $member
     * @return JsonResponse
     */
    public function update(UpdateMemberSharesRequest $request, User $member): JsonResponse
    {
        // Tenant isolation and role check
        if ($member->sacco_id !== $request->user()->sacco_id || $member->role !== 'member') {
            return $this->forbidden('You do not have permission to update shares for this member.');
        }

        $member->update([
            'num_shares' => $request->validated('num_shares'),
        ]);

        return $this->success(
            UserResource::make($member->fresh()),
            'Member shares updated successfully.'
        );
    }
}
