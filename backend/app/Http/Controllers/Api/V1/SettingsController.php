<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\UpdateSettingsRequest;
use App\Http\Resources\V1\SettingResource;
use App\Http\Traits\ApiResponse;
use App\Models\Setting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    use ApiResponse;

    /**
     * Get the SACCO's settings.
     *
     * Returns the authenticated admin's SACCO settings, creating a
     * default row on first access if one does not exist yet.
     *
     * @param Request $request
     * @return SettingResource
     */
    public function show(Request $request): SettingResource
    {
        $setting = Setting::firstOrCreate(
            ['sacco_id' => $request->user()->sacco_id],
        );

        // firstOrCreate() may have just inserted the default row. Laravel's
        // JsonResource response automatically returns 201 for a model where
        // wasRecentlyCreated is true, but this is a GET endpoint returning
        // the SACCO's settings (creating defaults transparently on first
        // access is an implementation detail, not a resource-creation
        // action), so the documented/expected contract is 200 either way.
        $setting->wasRecentlyCreated = false;

        return SettingResource::make($setting);
    }

    /**
     * Update the SACCO's settings.
     *
     * @param UpdateSettingsRequest $request
     * @return SettingResource
     */
    public function update(UpdateSettingsRequest $request): SettingResource
    {
        $setting = Setting::firstOrCreate(
            ['sacco_id' => $request->user()->sacco_id],
        );

        // See show() above: this is a PUT that updates (and transparently
        // creates, if missing) the SACCO's settings, not a resource-creation
        // endpoint, so it must keep returning 200 per the existing contract
        // even when firstOrCreate() had to insert the row.
        $setting->wasRecentlyCreated = false;

        $setting->update($request->validated());

        ActivityLogger::settingsUpdated($request, ['sacco_id' => $request->user()->sacco_id]);

        return SettingResource::make($setting);
    }
}
