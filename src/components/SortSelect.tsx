"use client";

import React from "react";

interface SortSelectProps {
  sort: string;
  options: { value: string; label: string }[];
}

export default function SortSelect({ sort, options }: SortSelectProps) {
  return (
    <select
      className="border rounded px-2 py-1"
      defaultValue={sort}
      onChange={e => {
        window.location.search = `?sort=${e.target.value}`;
      }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
