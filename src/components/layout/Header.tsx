"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BurgerIcon, ChevronRightIcon, CloseIcon } from "@/components/icons";
import { SearchBar } from "@/components/layout/SearchBar";
import { cartItemCount, useCartStore } from "@/lib/cart/store";
import type { ProductCategory } from "@/lib/repo/types";

const INSTALLER_CTA_HREF = "/postani-instalater";

function Logo() {
  const t = useTranslations("Header");
  return (
    <Link href="/" className="flex shrink-0 flex-col gap-1.5" aria-label={t("logoAriaLabel")}>
      <span className="text-[25px] leading-none tracking-[.3em]">
        ON<span className="text-accent">Y</span>X
      </span>
      <span className="flex items-center gap-2">
        <span className="h-px w-2.5 bg-accent" aria-hidden />
        <span className="text-badge text-accent">EVOLUTION</span>
        <span className="h-px w-2.5 bg-accent" aria-hidden />
      </span>
    </Link>
  );
}

function CartChip() {
  const t = useTranslations("Header");
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const items = useCartStore((s) => s.items);
  const count = hasHydrated ? cartItemCount(items) : 0;

  return (
    <Link
      href="/korpa"
      className="notch notch-9 flex items-center gap-2.5 border border-[rgba(42,179,230,.4)] px-4 py-2.5 label-nav text-accent transition-colors duration-200 hover:bg-[rgba(42,179,230,.1)]"
    >
      {t("cart")} <span className="text-text-40">({count})</span>
    </Link>
  );
}

/** Slug of the category page currently open, if any. `usePathname()` from
 * next-intl returns the internal route template ("/kategorija/[slug]") once
 * localized pathnames are configured, so the slug has to come from params. */
function useActiveCategorySlug(): string | null {
  const pathname = usePathname();
  const params = useParams<{ slug?: string }>();
  return pathname === "/kategorija/[slug]" ? (params.slug ?? null) : null;
}

function CategoryNav({ categories }: { categories: ProductCategory[] }) {
  const t = useTranslations("Header");
  const activeSlug = useActiveCategorySlug();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    function updateFades() {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }

    updateFades();
    el.addEventListener("scroll", updateFades, { passive: true });
    const resizeObserver = new ResizeObserver(updateFades);
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener("scroll", updateFades);
      resizeObserver.disconnect();
    };
  }, [categories]);

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="scrollbar-hide flex h-12 items-center gap-8.5 overflow-x-auto label-nav text-text-60"
      >
        {categories.map((category) => {
          const active = category.slug === activeSlug;
          return (
            <Link
              key={category.slug}
              href={{ pathname: "/kategorija/[slug]", params: { slug: category.slug } }}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 border-b pb-0.5 whitespace-nowrap transition-colors duration-200 ${
                active
                  ? "border-accent text-text"
                  : "border-transparent hover:text-text"
              }`}
            >
              {category.name.toUpperCase()}
            </Link>
          );
        })}
        <Link
          href={INSTALLER_CTA_HREF}
          className="ml-auto shrink-0 whitespace-nowrap text-accent transition-colors duration-200 hover:text-accent-hi"
        >
          {t("installerCta")}
        </Link>
      </div>

      {/* Edge fades hint that the row scrolls — only shown while there's
          actually more content in that direction. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[rgba(7,8,10,.92)] to-transparent transition-opacity duration-200 ${
          canScrollLeft ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-end bg-gradient-to-l from-[rgba(7,8,10,.92)] to-transparent pr-0.5 transition-opacity duration-200 ${
          canScrollRight ? "opacity-100" : "opacity-0"
        }`}
      >
        <ChevronRightIcon size={12} className="text-accent" />
      </div>
    </div>
  );
}

interface MobileMenuDrawerProps {
  open: boolean;
  onClose: () => void;
  categories: ProductCategory[];
}

/**
 * Portaled to document.body — the header has `backdrop-filter`, which (per
 * spec) establishes a containing block for `position: fixed` descendants.
 * Left inline, this drawer would position itself relative to the ~84px-tall
 * header instead of the viewport, only ever covering that sliver. A portal
 * sidesteps that entirely, same reason src/components/cart/CartDrawer.tsx
 * lives at the layout root rather than inside Header.
 */
function MobileMenuDrawer({ open, onClose, categories }: MobileMenuDrawerProps) {
  const t = useTranslations("Header");
  const activeSlug = useActiveCategorySlug();
  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 cursor-pointer bg-onyx-900/80 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("menu")}
        className={`absolute top-0 right-0 flex h-full w-full flex-col bg-onyx-900 transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-hairline px-6">
          <span className="label-nav text-text">{t("menu")}</span>
          <button
            type="button"
            aria-label={t("closeMenu")}
            onClick={onClose}
            className="cursor-pointer text-text-60 transition-colors duration-200 hover:text-text"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-7">
          <SearchBar />

          <nav aria-label={t("categoryNavAriaLabel")} className="mt-8 flex flex-col">
            {categories.map((category) => {
              const active = category.slug === activeSlug;
              return (
                <Link
                  key={category.slug}
                  href={{ pathname: "/kategorija/[slug]", params: { slug: category.slug } }}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[52px] items-center border-b border-hairline font-mono text-[13px] tracking-[.14em] uppercase transition-colors duration-200 ${
                    active ? "text-accent" : "text-text-60 hover:text-text"
                  }`}
                >
                  {category.name.toUpperCase()}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 flex flex-col gap-1">
            <Link
              href={INSTALLER_CTA_HREF}
              className="flex min-h-[44px] items-center font-mono text-[13px] tracking-[.14em] text-accent uppercase transition-colors duration-200 hover:text-accent-hi"
            >
              {t("installerCta")}
            </Link>
            <Link
              href="/garancija"
              className="flex min-h-[44px] items-center font-mono text-[13px] tracking-[.14em] text-text-60 uppercase transition-colors duration-200 hover:text-text"
            >
              {t("warranty")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface HeaderProps {
  categories: ProductCategory[];
}

export function Header({ categories }: HeaderProps) {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  // The portal target (document.body) only exists on the client — rendering
  // it unconditionally would desync the first client render from the
  // server's, so it waits for this mount flag instead.
  const [mounted, setMounted] = useState(false);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setDrawerOpen(false);
  }

  useEffect(() => {
    // Flips only after the client's first render, so that render still
    // matches the server's (portal target doesn't exist there either way) —
    // reading document.body during render would desync hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-hairline bg-[rgba(7,8,10,.92)] backdrop-blur-[14px]">
        <div className="container-onyx flex h-[84px] items-center gap-8 lg:gap-12">
          <Logo />

          <SearchBar className="hidden max-w-[520px] flex-1 lg:block" />

          <div className="ml-auto hidden items-center gap-6.5 label-nav text-text-60 lg:flex">
            <Link href="/garancija" className="transition-colors duration-200 hover:text-text">
              {t("warranty")}
            </Link>
            <CartChip />
          </div>

          <div className="ml-auto flex items-center gap-4 lg:hidden">
            <CartChip />
            <button
              type="button"
              aria-label={drawerOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
              className="text-text"
            >
              {drawerOpen ? <CloseIcon /> : <BurgerIcon />}
            </button>
          </div>
        </div>

        <nav
          aria-label={t("categoryNavAriaLabel")}
          className="hidden border-t border-hairline lg:block"
        >
          <div className="container-onyx">
            <CategoryNav categories={categories} />
          </div>
        </nav>
      </header>

      {mounted &&
        createPortal(
          <MobileMenuDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            categories={categories}
          />,
          document.body,
        )}
    </>
  );
}
