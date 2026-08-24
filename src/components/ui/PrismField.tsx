export interface PrismFieldProps {
  className?: string;
}

/**
 * The faceted prism pattern. Place inside a `position: relative` dark band.
 * Hidden below 768px, never behind text, at most one instance per page.
 */
export function PrismField({ className = "" }: PrismFieldProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 left-[52%] right-0 hidden md:block ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[.82] mix-blend-screen"
        style={{
          backgroundImage: "url(/patterns/onyx-prism.svg)",
          backgroundSize: "cover",
          backgroundPosition: "right top",
          backgroundRepeat: "no-repeat",
          maskImage:
            "radial-gradient(128% 132% at 100% 4%, #000 0%, #000 38%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(128% 132% at 100% 4%, #000 0%, #000 38%, transparent 82%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(72% 78% at 92% 18%, rgba(42,179,230,.2) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute right-0 bottom-0 h-px w-[62%]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(42,179,230,.55))",
        }}
      />
    </div>
  );
}
