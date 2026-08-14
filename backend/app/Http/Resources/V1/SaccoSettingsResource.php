<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read float|int|string $share_value
 * @property-read string|null $currency
 */
class SaccoSettingsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'share_value' => (float) $this->share_value,
            'currency' => $this->currency ?? 'KES',
        ];
    }
}
