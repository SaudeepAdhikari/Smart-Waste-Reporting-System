'use client';

import {
  SEVERITY_LEVELS,
  severityDescriptions,
  severityLabels,
  type ReportSeverity,
} from '@/types/reports';

interface SeverityFieldProps {
  value: ReportSeverity | '';
  onChange: (value: ReportSeverity) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
}

export function SeverityField({
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
}: SeverityFieldProps) {
  return (
    <fieldset className="space-y-3" disabled={disabled}>
      <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Initial severity assessment
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      </legend>
      <p id="severity-hint" className="text-sm text-zinc-500 dark:text-zinc-400">
        This is your initial assessment only. Municipal staff and the system may
        later recalculate priority using the official weighted algorithm.
      </p>

      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        role="radiogroup"
        aria-labelledby="severity-hint"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'severity-error' : undefined}
        onBlur={onBlur}
      >
        {SEVERITY_LEVELS.map((level) => {
          const selected = value === level;
          return (
            <label
              key={level}
              className={`flex cursor-pointer gap-3 rounded-md border p-4 transition-colors focus-within:ring-2 focus-within:ring-green-500 ${
                selected
                  ? 'border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-900/20'
                  : 'border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-500'
              }`}
            >
              <input
                type="radio"
                name="severity"
                value={level}
                checked={selected}
                disabled={disabled}
                onChange={() => onChange(level)}
                className="mt-1 h-4 w-4 shrink-0 border-zinc-300 text-green-600 focus:ring-green-500"
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {severityLabels[level]}
                </span>
                <span className="mt-0.5 block text-sm text-zinc-600 dark:text-zinc-400">
                  {severityDescriptions[level]}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      {error && (
        <p
          id="severity-error"
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}
