<?php

namespace App\Http\Requests\V1;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
    return [
        'loan_interest_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
        'savings_interest_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
        'dividend_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
        'share_value' => ['sometimes', 'numeric', 'min:0'],
        'currency' => ['sometimes', 'string', 'max:10'],
    ];
    }
}
