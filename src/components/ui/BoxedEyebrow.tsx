import type { ReactNode } from "react";

export interface BoxedEyebrowProps {
  children: ReactNode;
  className?: string;
}

export function BoxedEyebrow({ children, className = "" }: BoxedEyebrowProps) {
  return (
    <div
      className={`inline-flex items-center border border-[rgba(42,179,230,.35)] px-3.5 py-2 font-mono text-[9px] tracking-[.3em] text-accent uppercase ${className}`}
    >
      {children}
    </div>
  );
}
