import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "primary" | "secondary" | "outline-accent";

interface SharedProps {
  variant?: Variant;
  compact?: boolean;
  trailingArrow?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-onyx-900 hover:bg-accent-hi",
  secondary:
    "bg-transparent border border-hairline-strong text-text hover:border-accent hover:text-accent",
  "outline-accent":
    "bg-transparent border border-accent text-accent hover:bg-accent hover:text-onyx-900",
};

export function Button({
  variant = "primary",
  compact = false,
  trailingArrow = false,
  children,
  className = "",
  href,
  ...rest
}: ButtonProps) {
  const base = `notch notch-12 label-button inline-flex cursor-pointer items-center justify-center gap-3 px-[30px] transition-colors duration-200 disabled:cursor-not-allowed ${
    compact ? "h-12" : "h-[54px]"
  } ${variantClasses[variant]} ${className}`;

  const content = (
    <>
      {children}
      {trailingArrow && <span aria-hidden="true"> →</span>}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={base}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={base}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
