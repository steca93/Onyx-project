import type { CSSProperties, ReactNode } from "react";

export interface LatticeProps {
  children: ReactNode;
  columns: number;
  className?: string;
}

export function Lattice({ children, columns, className = "" }: LatticeProps) {
  const style: CSSProperties = {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
  };

  return (
    <div className={`lattice ${className}`} style={style}>
      {children}
    </div>
  );
}
