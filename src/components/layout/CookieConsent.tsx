"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "onyx-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Read localStorage only after mount so the client's first render
    // matches the server-rendered (window-less) markup — reading it during
    // render would desync hydration.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(!localStorage.getItem(STORAGE_KEY));
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Private browsing / blocked storage — banner just won't persist dismissal.
    }
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline-strong bg-onyx-900">
      <div className="container-onyx flex flex-col items-start gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[620px] text-body-sm text-text-60">
          Ovaj sajt koristi neophodne kolačiće da bi tvoja korpa i sesija
          ostale aktivne. Detalje pogledaj u{" "}
          <Link
            href="/uslovi-koriscenja#politika-privatnosti"
            className="text-accent underline underline-offset-2 hover:no-underline"
          >
            politici privatnosti
          </Link>
          .
        </p>
        <Button compact onClick={dismiss} className="w-full shrink-0 sm:w-auto">
          RAZUMEM
        </Button>
      </div>
    </div>
  );
}
