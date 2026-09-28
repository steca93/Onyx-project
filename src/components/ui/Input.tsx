import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="label-column text-text-40">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={`notch notch-12 h-11 border border-hairline bg-onyx-800 px-4 font-sans text-[13.5px] tracking-normal text-text outline-none placeholder:font-mono placeholder:text-[10.5px] placeholder:tracking-[.18em] placeholder:text-text-34 focus:border-[rgba(42,179,230,.55)] ${className}`}
          {...rest}
        />
        {error && (
          <p id={errorId} className="font-mono text-[10px] tracking-[.08em] text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
