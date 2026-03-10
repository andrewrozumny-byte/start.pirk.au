"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { AUSTRALIAN_STATES } from "@/config/procedures";

export function SurgeonFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? ""
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/surgeons?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams("search", value);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-grey" />
        <input
          type="text"
          placeholder="Search surgeons by name, practice, or suburb..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-lg border border-coral-mid/30 bg-white py-2 pl-10 pr-4 text-sm text-near-black placeholder:text-warm-grey/60 focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral"
        />
      </div>
      <select
        value={searchParams.get("state") ?? ""}
        onChange={(e) => updateParams("state", e.target.value)}
        className="rounded-lg border border-coral-mid/30 bg-white px-3 py-2 text-sm text-near-black focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral"
      >
        <option value="">All States</option>
        {AUSTRALIAN_STATES.map((s) => (
          <option key={s.code} value={s.code}>
            {s.code} &mdash; {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
