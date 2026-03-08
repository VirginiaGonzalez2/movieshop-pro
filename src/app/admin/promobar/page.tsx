"use client";
import { useState } from "react";

const allPages = [
  "/", "/movies", "/cart", "/checkout", "/wishlist", "/contact-us"
];

const colorOptions = [
  { name: "Brand Blue", value: "#2563eb" },
  { name: "Red (Christmas)", value: "#a5091a" },
  { name: "Orange (Halloween)", value: "#f97316" },
  { name: "Green (Offers)", value: "#22c55e" },
  { name: "Purple (Events)", value: "#7c3aed" },
  { name: "Yellow (Summer)", value: "#facc15" },
  { name: "Black (Black Friday)", value: "#222" },
];


import { useEffect } from "react";
import useSWR from "swr";

export default function PromoBarAdmin() {
  const { data: promo, mutate } = useSWR("/api/promobar", async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch PromoBar config");
    return await res.json();
  });

  const [promoText, setPromoText] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visiblePages, setVisiblePages] = useState<string[]>(["/"]);
  const [color, setColor] = useState("#2563eb");
  const [customColor, setCustomColor] = useState("");

  useEffect(() => {
    if (promo) {
      setPromoText(promo.promoText || "");
      setEndDate(promo.endDate ? promo.endDate.replace("Z","") : "");
      setVisiblePages(promo.visiblePages ? promo.visiblePages.split(",") : ["/"]);
      setColor(promo.color || "#2563eb");
      setCustomColor("");
    }
  }, [promo]);

  const handlePageToggle = (page: string) => {
    setVisiblePages((prev) =>
      prev.includes(page)
        ? prev.filter((p) => p !== page)
        : [...prev, page]
    );
  };

  const handleSave = async () => {
    const config = {
      promoText,
      endDate,
      visiblePages: visiblePages.join(","),
      color: customColor || color,
    };
    const res = await fetch("/api/promobar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (res.ok) {
      alert("PromoBar config saved!");
      mutate(); // Refresca el estado
    } else {
      alert("Error saving PromoBar config");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">PromoBar Editor</h2>
      <label className="block mb-2 font-semibold">Promo Text</label>
      <input
        type="text"
        value={promoText}
        onChange={e => setPromoText(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <label className="block mb-2 font-semibold">End Date</label>
      <input
        type="datetime-local"
        value={endDate.replace('Z','')}
        onChange={e => setEndDate(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <label className="block mb-2 font-semibold">Visible Pages</label>
      <div className="mb-4 flex flex-wrap gap-2">
        {allPages.map(page => (
          <button
            key={page}
            type="button"
            className={`px-3 py-1 rounded border ${visiblePages.includes(page) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => handlePageToggle(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <label className="block mb-2 font-semibold">Promo Bar Color</label>
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        {colorOptions.map(opt => (
          <button
            key={opt.value}
            type="button"
            className={`px-3 py-1 rounded border ${color === opt.value && !customColor ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            style={{ backgroundColor: opt.value, color: color === opt.value && !customColor ? '#fff' : undefined }}
            onClick={() => { setColor(opt.value); setCustomColor(""); }}
          >
            {opt.name}
          </button>
        ))}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`px-3 py-1 rounded border ${customColor ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            style={{ backgroundColor: customColor || '#fff', color: customColor ? '#fff' : undefined }}
            onClick={() => { setColor(""); setCustomColor(customColor || color); }}
          >
            Custom
          </button>
          {customColor !== "" && (
            <input
              type="color"
              value={customColor}
              onChange={e => setCustomColor(e.target.value)}
              className="w-10 h-10 border rounded cursor-pointer"
            />
          )}
        </div>
      </div>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded font-bold"
        onClick={handleSave}
      >
        Save PromoBar
      </button>
    </div>
  );
}
