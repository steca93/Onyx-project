import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function iconProps(size: number, props: IconProps) {
  const { size: _sizeOverride, ...rest } = props;
  void _sizeOverride;
  return { width: size, height: size, viewBox: "0 0 24 24", ...rest };
}

export function SearchIcon(props: IconProps) {
  return (
    <svg
      {...iconProps(18, props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" strokeLinecap="round" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg
      {...iconProps(18, props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="21" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="21" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BurgerIcon(props: IconProps) {
  return (
    <svg
      {...iconProps(20, props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg
      {...iconProps(18, props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg
      {...iconProps(16, props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg
      {...iconProps(16, props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg
      {...iconProps(14, props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M5 8l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg
      {...iconProps(14, props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg
      {...iconProps(14, props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg
      {...iconProps(12, props)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M4 12l5 5 11-11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
