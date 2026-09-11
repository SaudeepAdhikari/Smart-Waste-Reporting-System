'use client';

import {
  QUANTITY_UNITS,
  quantityUnitLabels,
  type QuantityUnit,
} from '@/types/reports';

interface QuantityFieldProps {
  quantity: number | '';
  unit: QuantityUnit | '';
  onQuantityChange: (value: number | '') => void;
  onUnitChange: (value: QuantityUnit) => void;
  onQuantityBlur: () => void;
  onUnitBlur: () => void;
  quantityError?: string;
  unitError?: string;
  disabled?: boolean;
}

export function QuantityField({
  quantity,
  unit,
  onQuantityChange,
  onUnitChange,
  onQuantityBlur,
  onUnitBlur,
  quantityError,
  unitError,
  disabled = false,
}: QuantityFieldProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <label
          htmlFor="estimatedQuantity"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Estimated quantity
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <p
          id="estimatedQuantity-hint"
          className="text-sm text-zinc-500 dark:text-zinc-400"
        >
          Approximate amount is fine — an estimate helps collectors prepare.
        </p>
        <input
          id="estimatedQuantity"
          name="estimatedQuantity"
          type="number"
          inputMode="decimal"
          min={0.01}
          step="any"
          value={quantity}
          disabled={disabled}
          onChange={(event) => {
            const raw = event.target.value;
            if (raw === '') {
              onQuantityChange('');
              return;
            }
            const parsed = Number(raw);
            onQuantityChange(Number.isNaN(parsed) ? '' : parsed);
          }}
          onBlur={onQuantityBlur}
          aria-invalid={quantityError ? 'true' : 'false'}
          aria-describedby={
            quantityError
              ? 'estimatedQuantity-hint estimatedQuantity-error'
              : 'estimatedQuantity-hint'
          }
          required
          placeholder="e.g. 3"
          className="min-h-11 w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 sm:text-sm"
        />
        {quantityError && (
          <p
            id="estimatedQuantity-error"
            className="text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {quantityError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="quantityUnit"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Quantity unit
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <p
          id="quantityUnit-hint"
          className="text-sm text-zinc-500 dark:text-zinc-400"
        >
          Select the unit that matches your estimate.
        </p>
        <select
          id="quantityUnit"
          name="quantityUnit"
          value={unit}
          disabled={disabled}
          onChange={(event) => onUnitChange(event.target.value as QuantityUnit)}
          onBlur={onUnitBlur}
          aria-invalid={unitError ? 'true' : 'false'}
          aria-describedby={
            unitError ? 'quantityUnit-hint quantityUnit-error' : 'quantityUnit-hint'
          }
          required
          className="min-h-11 w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:text-sm"
        >
          <option value="" disabled>
            Select unit
          </option>
          {QUANTITY_UNITS.map((item) => (
            <option key={item} value={item}>
              {quantityUnitLabels[item]}
            </option>
          ))}
        </select>
        {unitError && (
          <p
            id="quantityUnit-error"
            className="text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {unitError}
          </p>
        )}
      </div>
    </div>
  );
}
