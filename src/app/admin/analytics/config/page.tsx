"use client";
import { useState, useEffect } from "react";
import { saveAnalyticsConfig } from "../../../actions/analytics";

export default function AnalyticsConfigPage() {
  const [gaId, setGaId] = useState("");
  const [gtmId, setGtmId] = useState("");

  // Aquí se puede conectar con backend para guardar los IDs
  const handleSave = () => {
    // TODO: Guardar en base de datos o archivo seguro
    alert("Guardado: GA=" + gaId + ", GTM=" + gtmId);
  };

  return (
    <div className="max-w-md mx-auto mt-8 space-y-6">
      <h2 className="text-xl font-semibold">Configurar Google Analytics y GTM</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Google Analytics ID</label>
          <input
            type="text"
            value={gaId}
            onChange={e => setGaId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="UA-XXXXXXXXX-X o G-XXXXXXXXXX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Google Tag Manager ID</label>
          <input
            type="text"
            value={gtmId}
            onChange={e => setGtmId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="GTM-XXXXXXX"
          />
        </div>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
