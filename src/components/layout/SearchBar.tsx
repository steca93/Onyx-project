"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { ImageSlot } from "@/components/ui/ImageSlot";
import type { SearchIndexProduct } from "@/lib/repo/types";
import { formatPrice } from "@/lib/utils/format-price";

export interface SearchBarProps {
  className?: string;
}

// Module-level index — fetched once per page load, shared across every
// SearchBar instance (desktop bar + mobile drawer both mount one). Once this
// resolves, every keystroke after is a client-side filter, not a network
// call — that's what makes the dropdown feel instant.
let indexPromise: Promise<SearchIndexProduct[]> | null = null;

function fetchIndex(): Promise<SearchIndexProduct[]> {
  if (!indexPromise) {
    indexPromise = fetch("/api/search-index")
      .then((res) => {
        if (!res.ok) throw new Error(`search-index ${res.status}`);
        return res.json() as Promise<SearchIndexProduct[]>;
      })
      .then((data) => {
        // An empty response likely means the upstream query failed
        // transiently — let the next search attempt retry instead of
        // caching the miss for the rest of the page's lifetime.
        if (!Array.isArray(data) || data.length === 0) {
          indexPromise = null;
          return [];
        }
        return data;
      })
      .catch(() => {
        indexPromise = null;
        return [];
      });
  }
  return indexPromise;
}

function filterProducts(
  index: SearchIndexProduct[],
  query: string,
): SearchIndexProduct[] {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  return index
    .filter((p) => tokens.every((t) => p.name.toLowerCase().includes(t)))
    .slice(0, 6);
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function SearchBar({ className = "" }: SearchBarProps) {
  const t = useTranslations("SearchBar");
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchIndexProduct[]>([]);
  const [open, setOpen] = useState(false);
  // The query `results` was last computed for — lets loading/fetched be
  // derived instead of tracked as their own state, so the fetch effect below
  // only ever sets state from inside its async callback, never synchronously
  // in the effect body itself.
  const [resolvedQuery, setResolvedQuery] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query.trim(), 150);

  // Warm the index up as soon as the bar mounts, before the user types.
  useEffect(() => {
    fetchIndex();
  }, []);

  // Filter the (already-fetched) index whenever the debounced query changes.
  // The "too short, clear everything" case is handled synchronously in
  // handleChange below instead of here — an effect that only mirrors a prop
  // into local state is exactly what useEffect is meant to avoid.
  useEffect(() => {
    if (debouncedQuery.length < 2) return;

    let cancelled = false;

    fetchIndex().then((index) => {
      if (cancelled) return;
      setResults(filterProducts(index, debouncedQuery));
      setResolvedQuery(debouncedQuery);
      setOpen(true);
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const fetched = resolvedQuery === debouncedQuery && debouncedQuery.length >= 2;
  const loading = debouncedQuery.length >= 2 && !fetched;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setOpen(false);
    setResolvedQuery(null);
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    router.push(`/pretraga?q=${encodeURIComponent(trimmed)}`);
  }

  function handleResultClick() {
    setOpen(false);
    setQuery("");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      setResolvedQuery(null);
      setOpen(false);
    }
  }

  const trimmedQuery = query.trim();
  const showDropdown = open && trimmedQuery.length >= 2;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} role="search" className="relative">
        <SearchIcon
          size={14}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-40"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (fetched && trimmedQuery.length >= 2) setOpen(true);
          }}
          placeholder={t("placeholder")}
          aria-label={t("ariaLabel")}
          aria-autocomplete="list"
          autoComplete="off"
          className="notch notch-12 h-11 w-full border border-hairline bg-onyx-800 pr-11 pl-10.5 font-sans text-[13.5px] tracking-normal text-text outline-none placeholder:font-mono placeholder:text-[10.5px] placeholder:tracking-[.18em] placeholder:text-text-34 focus:border-[rgba(42,179,230,.55)]"
        />
        {trimmedQuery ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label={t("clearAriaLabel")}
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-text-40 transition-colors duration-200 hover:text-accent"
          >
            <CloseIcon size={12} />
          </button>
        ) : (
          <button
            type="submit"
            aria-label={t("submitAriaLabel")}
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer font-mono text-accent"
          >
            ↵
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 border border-hairline bg-onyx-850">
          {/* Keyed off `results.length` first, not `loading`, so a query
              that resolves while the previous query's results are still on
              screen just replaces them in one update — it never blanks the
              list out for a spinner in between. The spinner only ever
              appears when there's truly nothing to show yet. */}
          {results.length === 0 && loading && (
            <div className="flex items-center justify-center px-4 py-8">
              <span
                aria-hidden
                className="h-4 w-4 animate-spin border-2 border-hairline-strong border-t-accent"
              />
            </div>
          )}

          {results.length === 0 && !loading && fetched && (
            <div className="px-5 py-8 text-center">
              <p className="label-nav text-text">
                {t("noResults", { query: trimmedQuery })}
              </p>
              <p className="mt-2.5 font-mono text-[10px] tracking-[.1em] text-text-40 uppercase">
                {t("noResultsHint")}
              </p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <ul>
                {results.map((product) => (
                  <li key={product.id} className="border-b border-hairline last:border-0">
                    <Link
                      href={`/proizvod/${product.slug}`}
                      onClick={handleResultClick}
                      className="group flex items-center gap-3.5 px-4 py-3 transition-colors duration-200 hover:bg-onyx-800"
                    >
                      <div className="relative h-11 w-11 shrink-0 border border-hairline bg-onyx-800">
                        <ImageSlot image={product.image} fill sizes="44px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-product-name truncate text-text group-hover:text-accent">
                          {product.name}
                        </p>
                        {product.price && (
                          <p className="text-price-sm mt-1 text-text-40">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={`/pretraga?q=${encodeURIComponent(trimmedQuery)}`}
                onClick={handleResultClick}
                className="flex items-center gap-2 border-t border-hairline px-4 py-3 label-nav text-accent transition-colors duration-200 hover:bg-onyx-800 hover:text-accent-hi"
              >
                <SearchIcon size={11} />
                {t("showAllResults", { query: trimmedQuery })}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
