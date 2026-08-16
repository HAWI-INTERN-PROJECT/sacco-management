<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\UpdateMemberSharesRequest;
use App\Http\Resources\V1\MemberResource;
use App\Http\Traits\ApiResponse;
use App\Models\Member;
use Illuminate\Http\JsonResponse;
use App\Services\ActivityLogger;

class MemberController extends Controller
{
    use ApiResponse;

    /**
     * Update a member's share capital balance.
     *
     * Restricted to the SACCO admin of the member's own SACCO. The
     * member id is resolved through the Member model (users with
     * role='member') scoped to the admin's sacco_id, so an admin can
     * never reach a member belonging to another SACCO.
     *
     * @param UpdateMemberSharesRequest $request
     * @param int $id
     * @return MemberResource|JsonResponse
     */
    public function updateShares(UpdateMemberSharesRequest $request, int $id): MemberResource|JsonResponse
    {
        $member = Member::where('sacco_id', $request->user()->sacco_id)
            ->where('id', $id)
            ->first();

        if (! $member) {
            return $this->notFound('Member not found.');
        }

        $previousShares = $member->shares;

        $member->update(['shares' => $request->validated('shares')]);

        ActivityLogger::memberSharesUpdated($request, [
            'member_id' => $member->id,
            'previous_shares' => $previousShares,
            'new_shares' => $member->shares,
        ]);

        return MemberResource::make($member);
    }
}
