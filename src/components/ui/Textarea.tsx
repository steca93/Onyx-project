import { forwardRef, useId } from "react";
import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = "", ...rest }, ref) => {
    const autoId = useId();
    const textareaId = id ?? autoId;
    const errorId = error ? `${textareaId}-error` : undefined;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={textareaId} className="label-column text-text-40">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={`notch notch-12 resize-none border border-hairline bg-onyx-800 px-4 py-3 font-sans text-[13.5px] text-text outline-none placeholder:font-mono placeholder:text-[10.5px] placeholder:tracking-[.18em] placeholder:text-text-34 focus:border-[rgba(42,179,230,.55)] ${className}`}
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

Textarea.displayName = "Textarea";
