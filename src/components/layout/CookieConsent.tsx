"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "onyx-cookie-consent";

export function CookieConsent() {
  const t = useTranslations("CookieConsent");
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
          {t.rich("message", {
            privacyLink: (chunks) => (
              <Link
                href={{ pathname: "/uslovi-koriscenja", hash: "politika-privatnosti" }}
                className="text-accent underline underline-offset-2 hover:no-underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
        <Button compact onClick={dismiss} className="w-full shrink-0 sm:w-auto">
          {t("accept")}
        </Button>
      </div>
    </div>
  );
}
