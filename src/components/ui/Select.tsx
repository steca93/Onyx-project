import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDownIcon } from "@/components/icons";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, id, className = "", ...rest }, ref) => {
    const autoId = useId();
    const selectId = id ?? autoId;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={selectId} className="label-column text-text-40">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            className={`notch notch-12 h-11 w-full appearance-none border border-hairline bg-onyx-800 px-4 pr-9 font-mono text-[10.5px] tracking-[.18em] text-text outline-none focus:border-[rgba(42,179,230,.55)] ${className}`}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            size={12}
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-text-40"
          />
        </div>
        {error && (
          <p id={errorId} className="font-mono text-[10px] tracking-[.08em] text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
