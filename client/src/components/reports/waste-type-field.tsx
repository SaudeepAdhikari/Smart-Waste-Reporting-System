'use client';

import { wasteTypeLabels, WASTE_TYPES, type WasteType } from '@/types/reports';

interface WasteTypeFieldProps {
  value: WasteType | '';
  onChange: (value: WasteType) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
}

export function WasteTypeField({
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
}: WasteTypeFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="wasteType"
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Waste type
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      </label>
      <p id="wasteType-hint" className="text-sm text-zinc-500 dark:text-zinc-400">
        Choose the category that best matches what you observed. If unsure, select
        Mixed or Other and describe it below.
      </p>
      <select
        id="wasteType"
        name="wasteType"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as WasteType)}
        onBlur={onBlur}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? 'wasteType-hint wasteType-error' : 'wasteType-hint'
        }
        required
        className="min-h-11 w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
      >
        <option value="" disabled>
          Select waste type
        </option>
        {WASTE_TYPES.map((type) => (
          <option key={type} value={type}>
            {wasteTypeLabels[type]}
          </option>
        ))}
      </select>
      {error && (
        <p
          id="wasteType-error"
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
