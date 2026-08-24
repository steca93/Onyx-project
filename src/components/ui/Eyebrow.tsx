import type { ReactNode } from "react";

export interface EyebrowProps {
  children: ReactNode;
  rule?: boolean;
  className?: string;
}

export function Eyebrow({ children, rule = false, className = "" }: EyebrowProps) {
  if (!rule) {
    return <div className={`eyebrow ${className}`}>{children}</div>;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px w-10 bg-accent" aria-hidden />
      <span className="eyebrow">{children}</span>
    </div>
  );
}
