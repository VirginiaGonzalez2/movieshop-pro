"use client";
import { useEffect, useState } from "react";

// PromoBar component for displaying promotions

export function PromoBar({ promo }: { promo: { promoText: string; endDate: string; color: string } }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!promo.endDate) return;
    const interval = setInterval(() => {
      const end = new Date(promo.endDate);
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) {
        setRemaining("00:00:00");
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setRemaining(`${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [promo.endDate]);

  const [hrs, mins, secs] = remaining.split(":");

  return (
    <div
      className="w-full text-white py-3 px-6 flex flex-col md:flex-row md:justify-center md:items-center font-bold tracking-wide"
      style={{
        fontFamily: 'Geist, Arial, sans-serif',
        letterSpacing: '0.04em',
        fontSize: '1.15rem',
        borderBottom: `2px solid ${promo.color || '#2563eb'}`,
        textShadow: '0 1px 4px rgba(0,0,0,0.15)',
        backgroundColor: promo.color || '#2563eb',
      }}
    >
      <div className="flex-1 text-center md:text-center">
        {promo.promoText}
        <span className="ml-4 font-normal text-base tracking-normal">SALE ENDS IN</span>
      </div>
      <div className="flex justify-center md:justify-start items-center gap-2 mt-2 md:mt-0">
        <div className="bg-[#1e3a8a] border border-white rounded px-3 py-1 text-center min-w-[60px]">
          <span className="block text-lg font-bold text-white">{hrs}</span>
          <span className="block text-xs font-semibold text-white">HRS</span>
        </div>
        <div className="bg-[#1e3a8a] border border-white rounded px-3 py-1 text-center min-w-[60px]">
          <span className="block text-lg font-bold text-white">{mins}</span>
          <span className="block text-xs font-semibold text-white">MIN</span>
        </div>
        <div className="bg-[#1e3a8a] border border-white rounded px-3 py-1 text-center min-w-[60px]">
          <span className="block text-lg font-bold text-white">{secs}</span>
          <span className="block text-xs font-semibold text-white">SEC</span>
        </div>
      </div>
    </div>
  );
}
