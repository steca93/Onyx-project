"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { installers } from "@/data/installers";

export default function InstallerNetworkPage() {
  const cities = useMemo(
    () => Array.from(new Set(installers.map((i) => i.city))).sort((a, b) => a.localeCompare(b, "sr")),
    [],
  );
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const filtered = activeCity
    ? installers.filter((i) => i.city === activeCity)
    : installers;

  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Početna", href: "/" },
          { label: "Ovlašćeni centri" },
        ]}
        title="Ovlašćeni centri"
        description="Mreža ovlašćenih instalatera za montažu ONYX folija i premaza u Srbiji."
      />

      <div className="container-onyx py-16 sm:py-20 lg:py-24">
        <div className="mb-12 flex flex-wrap gap-3" role="group" aria-label="Filter po gradu">
          <button
            type="button"
            onClick={() => setActiveCity(null)}
            aria-pressed={activeCity === null}
            className={`notch notch-9 border px-4 py-2 label-nav transition-colors duration-200 ${
              activeCity === null
                ? "border-accent bg-accent text-onyx-900"
                : "border-hairline text-text-60 hover:border-accent hover:text-accent"
            }`}
          >
            SVI
          </button>
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setActiveCity(city)}
              aria-pressed={activeCity === city}
              className={`notch notch-9 border px-4 py-2 label-nav transition-colors duration-200 ${
                activeCity === city
                  ? "border-accent bg-accent text-onyx-900"
                  : "border-hairline text-text-60 hover:border-accent hover:text-accent"
              }`}
            >
              {city.toUpperCase()}
            </button>
          ))}
        </div>

        {/* A plain bordered-card grid, not Lattice — the filtered count
            varies and rarely fills a full row, which leaves a visible empty
            rectangle where Lattice's shared background shows through empty
            grid tracks. */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((installer) => (
            <div
              key={installer.id}
              className="flex min-w-0 flex-col gap-4 border border-hairline bg-onyx-800 p-7"
            >
              <div>
                <div className="label-column mb-2 text-text-40">
                  {installer.city.toUpperCase()}
                </div>
                <div className="text-h3-card text-[20px] text-text">
                  {installer.name}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-body-sm text-text-60">
                <span>{installer.address}</span>
                <span>{installer.phone}</span>
                <span>{installer.workingHours}</span>
              </div>
              <a
                href={installer.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label-nav mt-2 text-accent transition-colors duration-200 hover:text-accent-hi"
              >
                POGLEDAJ NA MAPI →
              </a>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="font-mono text-[11px] tracking-[.1em] text-text-40 uppercase">
            Nema centara u ovom gradu.
          </p>
        )}
      </div>
    </div>
  );
}
