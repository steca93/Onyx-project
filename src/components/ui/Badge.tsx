import type { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span className={`text-badge bg-accent px-2.5 py-1.5 text-onyx-900 ${className}`}>
      {children}
    </span>
  );
}
