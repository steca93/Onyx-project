export interface SpecTickerProps {
  items: string[];
}

export function SpecTicker({ items }: SpecTickerProps) {
  return (
    <div className="border-t border-accent-line border-b border-hairline bg-onyx-900">
      <div className="container-onyx flex h-[62px] items-center justify-between gap-6 overflow-x-auto font-mono text-[10px] tracking-[.24em] text-text-60 uppercase">
        {items.map((item, i) => (
          <div key={item} className="flex items-center gap-6 whitespace-nowrap">
            {i > 0 && (
              <span className="text-[rgba(42,179,230,.5)]" aria-hidden>
                ◆
              </span>
            )}
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
