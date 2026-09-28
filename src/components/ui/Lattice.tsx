import type { CSSProperties, ReactNode } from "react";

export interface LatticeProps {
  children: ReactNode;
  /** Fixed column count. Omit and pass responsive `grid-cols-*` utilities via
   * `className` instead when the count needs to vary across breakpoints. */
  columns?: number;
  className?: string;
}

export function Lattice({ children, columns, className = "" }: LatticeProps) {
  const style: CSSProperties | undefined = columns
    ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
    : undefined;

  return (
    <div className={`lattice ${className}`} style={style}>
      {children}
    </div>
  );
}
