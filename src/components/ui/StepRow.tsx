import { Lattice } from "./Lattice";

export interface Step {
  number: string;
  text: string;
}

export interface StepRowProps {
  steps: Step[];
  className?: string;
}

export function StepRow({ steps, className = "" }: StepRowProps) {
  return (
    <Lattice columns={steps.length} className={className}>
      {steps.map((step) => (
        <div key={step.number} className="px-[22px] py-6">
          <div className="text-step-numeral mb-3 text-accent">{step.number}</div>
          <div className="text-body-sm text-text-60">{step.text}</div>
        </div>
      ))}
    </Lattice>
  );
}
