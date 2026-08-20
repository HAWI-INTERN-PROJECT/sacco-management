<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreMemberRequest;
use App\Http\Requests\Api\V1\UpdateMemberRequest;
use App\Http\Resources\V1\UserResource;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Hash;

class MemberController extends Controller
{
    use ApiResponse;

    /**
     * Get a query builder scoped to members of the admin's SACCO.
     *
     * @param  Request  $request
     * @return Builder<User>
     */
    private function getScopedMemberQuery(Request $request): Builder
    {
        return User::where('sacco_id', $request->user()->sacco_id)
            ->where('role', 'member')
            ->addSelect([
                'savings_balance' => \App\Models\SavingsTransaction::select('balance_after')
                    ->whereColumn('member_id', 'users.id')
                    ->latest('id')
                    ->limit(1)
            ]);
    }

    /**
     * List all members in the SACCO.
     *
     * @param  Request  $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = $this->getScopedMemberQuery($request);

        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('email', 'like', $searchTerm)
                  ->orWhere('phone', 'like', $searchTerm);
            });
        }

        // Status filter: 'active', 'inactive', or 'all'
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
            // 'all' => no filter
        }

        if ($request->sort === 'name') {
            $query->orderBy('name', 'asc');
        } else {
            $query->latest();
        }

        $members = $query->paginate(15);

        return UserResource::collection($members);
    }

    /**
     * Create a new member in the SACCO.
     *
     * @param  StoreMemberRequest  $request
     * @return JsonResponse
     */
    public function store(StoreMemberRequest $request): JsonResponse
    {
        $member = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => 'member',
            'sacco_id' => $request->user()->sacco_id,
        ]);

        return $this->created(
            UserResource::make($member),
            'Member created successfully.'
        );
    }

    /**
     * View a specific member.
     *
     * @param  Request  $request
     * @param  User  $member
     * @return JsonResponse|UserResource
     */
    public function show(Request $request, User $member)
    {
        // Tenant Isolation Check
        if ($member->sacco_id !== $request->user()->sacco_id || $member->role !== 'member') {
            return $this->forbidden('You do not have permission to view this member.');
        }

        return UserResource::make($member);
    }

    /**
     * Update a specific member.
     *
     * @param  UpdateMemberRequest  $request
     * @param  User  $member
     * @return JsonResponse
     */
    public function update(UpdateMemberRequest $request, User $member): JsonResponse
    {
        // Tenant Isolation Check
        if ($member->sacco_id !== $request->user()->sacco_id || $member->role !== 'member') {
            return $this->forbidden('You do not have permission to update this member.');
        }

        $data = $request->validated();

        // Hash password if provided
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $member->update($data);

        return $this->success(
            UserResource::make($member->fresh()),
            'Member updated successfully.'
        );
    }

    /**
     * Delete a specific member.
     *
     * @param  Request  $request
     * @param  User  $member
     * @return JsonResponse
     */
    public function destroy(Request $request, User $member): JsonResponse
    {
        // Tenant Isolation Check
        if ($member->sacco_id !== $request->user()->sacco_id || $member->role !== 'member') {
            return $this->forbidden('You do not have permission to delete this member.');
        }

        $member->delete();

        return $this->deleted('Member deleted successfully.');
    }
}
