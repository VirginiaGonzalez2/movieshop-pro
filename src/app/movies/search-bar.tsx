"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui/SearchInput";

export default function MoviesSearchBar({
  onSearch,
}: {
  onSearch: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="w-full max-w-xs">
      <SearchInput
        value={value}
        placeholder="Search movies…"
        onValueChange={(v) => {
          setValue(v);
          onSearch(v);
        }}
      />
    </div>
  );
}
