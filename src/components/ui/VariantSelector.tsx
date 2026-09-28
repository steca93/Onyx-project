"use client";

import { useEffect, useState } from "react";
import type { ProductAttribute, ProductVariation } from "@/lib/repo/types";

export interface VariantSelectorProps {
  attributes: ProductAttribute[];
  variations: ProductVariation[];
  onChange: (variation: ProductVariation | null) => void;
}

function resolveVariation(
  variations: ProductVariation[],
  attributes: ProductAttribute[],
  selected: Record<string, string>,
): ProductVariation | null {
  if (attributes.some((attr) => !selected[attr.name])) return null;
  return (
    variations.find((variation) =>
      variation.attributes.every((a) => selected[a.name] === a.value),
    ) ?? null
  );
}

function optionAvailable(
  variations: ProductVariation[],
  selected: Record<string, string>,
  attrName: string,
  value: string,
): boolean {
  return variations.some((variation) =>
    variation.attributes.every(
      (a) => a.name !== attrName ? selected[a.name] === undefined || selected[a.name] === a.value : a.value === value,
    ),
  );
}

export function VariantSelector({
  attributes,
  variations,
  onChange,
}: VariantSelectorProps) {
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const attr of attributes) {
      if (attr.options[0]) initial[attr.name] = attr.options[0];
    }
    return initial;
  });

  useEffect(() => {
    onChange(resolveVariation(variations, attributes, selected));
    // Only re-resolve when the selection itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="flex flex-col gap-5">
      {attributes.map((attr) => (
        <div key={attr.name}>
          <div className="label-column mb-3 text-text-40">{attr.label}</div>
          <div className="flex flex-wrap gap-2.5">
            {attr.options.map((option) => {
              const isSelected = selected[attr.name] === option;
              const available = optionAvailable(variations, selected, attr.name, option);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isSelected}
                  disabled={!available}
                  onClick={() =>
                    setSelected((prev) => ({ ...prev, [attr.name]: option }))
                  }
                  className={`notch notch-12 border px-4 py-2.5 font-mono text-[11px] tracking-[.14em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-30 ${
                    isSelected
                      ? "border-accent bg-accent text-onyx-900"
                      : "border-hairline text-text-60 hover:border-accent hover:text-accent"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
