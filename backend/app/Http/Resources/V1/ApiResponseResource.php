<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApiResponseResource extends JsonResource
{
    public static $wrap = null;

    /**
     * @return array{success: bool, message: string, data: mixed}
     */
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'message' => 'Success',
            'data' => parent::toArray($request),
        ];
    }
}
