"use client";

import { useState } from "react";
import { PlusIcon, MinusIcon } from "@/components/icons";

export interface AccordionItem {
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col border-t border-hairline">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `accordion-panel-${index}`;
        const buttonId = `accordion-button-${index}`;

        return (
          <div key={item.question} className="border-b border-hairline">
            <button
              type="button"
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="text-body text-text">{item.question}</span>
              <span className="shrink-0 text-accent" aria-hidden>
                {isOpen ? <MinusIcon size={14} /> : <PlusIcon size={14} />}
              </span>
            </button>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="pb-6"
              >
                <p className="text-body-sm max-w-[720px] text-text-60">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
