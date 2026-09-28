import { MinusIcon, PlusIcon } from "@/components/icons";

export interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
}: QuantityStepperProps) {
  const canDecrease = value > min;
  const canIncrease = max === undefined || value < max;

  return (
    <div className="inline-flex h-11 items-stretch border border-hairline">
      <button
        type="button"
        aria-label="Smanji količinu"
        disabled={!canDecrease}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex w-10 cursor-pointer items-center justify-center text-text-60 transition-colors duration-200 hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-text-60"
      >
        <MinusIcon size={12} />
      </button>
      <span className="flex w-10 items-center justify-center font-mono text-[13px] text-text" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Povećaj količinu"
        disabled={!canIncrease}
        onClick={() => onChange(max ? Math.min(max, value + 1) : value + 1)}
        className="flex w-10 cursor-pointer items-center justify-center text-text-60 transition-colors duration-200 hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-text-60"
      >
        <PlusIcon size={12} />
      </button>
    </div>
  );
}
