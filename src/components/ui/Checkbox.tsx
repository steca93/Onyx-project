import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { CheckIcon } from "@/components/icons";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className = "", ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="flex items-start gap-3 cursor-pointer">
          <span className="relative mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center border border-hairline-strong bg-onyx-800 [&:has(input:checked)]:border-accent [&:has(input:checked)]:bg-accent">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              aria-invalid={error ? true : undefined}
              aria-describedby={errorId}
              className={`peer absolute inset-0 h-full w-full cursor-pointer opacity-0 ${className}`}
              {...rest}
            />
            <CheckIcon
              size={11}
              aria-hidden
              className="pointer-events-none hidden text-onyx-900 peer-checked:block"
            />
          </span>
          <span className="text-body-sm text-text-60">{label}</span>
        </label>
        {error && (
          <p id={errorId} className="font-mono text-[10px] tracking-[.08em] text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
