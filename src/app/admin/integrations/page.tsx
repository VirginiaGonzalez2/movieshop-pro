

"use client";
import { useEffect, useState } from "react";

type Integration = {
  id: number;
  platform: string;
  apiKey: string;
  settings: any;
  createdAt: string;
  updatedAt: string;
};

const recommendedPlatforms = [
  "Mailchimp", "SendGrid", "Zapier", "Klaviyo", "Meta Ads", "Google Ads", "HubSpot", "Intercom",
  "n8n (Open Source)", "Make (ex Integromat)", "Pipedream", "Zapier+OpenAI (AI Automation)"
];

function IntegrationCard({ integration, onEdit, onDelete }: {
  integration: Integration;
  onEdit: (integration: Integration) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border">
      <div>
        <div className="font-bold text-lg">{integration.platform}</div>
        <div className="text-xs text-muted-foreground">Última actualización: {new Date(integration.updatedAt).toLocaleString()}</div>
        <div className="text-xs text-muted-foreground">API Key: {integration.apiKey ? "••••••••" : <span className="text-red-500">No configurada</span>}</div>
        <div className="text-xs text-muted-foreground">Settings: {integration.settings ? <code className="bg-gray-100 px-1 rounded">{JSON.stringify(integration.settings)}</code> : <span className="text-gray-400">N/A</span>}</div>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded bg-blue-600 text-white font-bold" onClick={() => onEdit(integration)}>Editar</button>
        <button className="px-3 py-1 rounded bg-red-600 text-white font-bold" onClick={() => onDelete(integration.id)}>Eliminar</button>
      </div>
    </div>
  );
}

export default function IntegrationsAdminPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selected, setSelected] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [settings, setSettings] = useState("");
  const [editingId, setEditingId] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/integrations")
      .then(async res => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setError(err.error || "Error al cargar integraciones");
          setIntegrations([]);
          return;
        }
        const data = await res.json().catch(() => []);
        if (Array.isArray(data)) {
          setIntegrations(data);
        } else if (Array.isArray(data.integrations)) {
          setIntegrations(data.integrations);
        } else {
          setIntegrations([]);
        }
      })
      .catch(() => {
        setError("Error de red al cargar integraciones");
        setIntegrations([]);
      });
  }, [loading]);

  const handleEdit = (integration: Integration) => {
    setEditingId(integration.id);
    setSelected(integration.platform);
    setApiKey(integration.apiKey || "");
    setSettings(integration.settings ? JSON.stringify(integration.settings, null, 2) : "");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this integration?")) return;
    setLoading(true);
    await fetch("/api/integrations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setLoading(false);
    setEditingId(null);
    setSelected("");
    setApiKey("");
    setSettings("");
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: selected,
          apiKey,
          settings: settings ? JSON.parse(settings) : null,
        }),
      });
      if (!res.ok) throw new Error("Error saving integration");
      setEditingId(null);
      setSelected("");
      setApiKey("");
      setSettings("");
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Integrations Admin</h2>
      <div className="mb-6">
        <div className="mb-2 text-sm text-muted-foreground">
          Conecta tu tienda con plataformas de automatización, marketing, email y AI para potenciar tu ecommerce. Recomendado: Zapier+OpenAI, Make, n8n, Pipedream.
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {recommendedPlatforms.map(p => (
            <span key={p} className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">{p}</span>
          ))}
        </div>
      </div>

      {/* List of integrations as cards */}
      <div className="space-y-4 mb-8">
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {integrations.length === 0 && !error && (
          <div className="text-gray-500 text-sm">No hay integraciones configuradas.</div>
        )}
        {integrations.map(integration => (
          <IntegrationCard key={integration.id} integration={integration} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>

      {/* Add/Edit integration form */}
      <div className="bg-white rounded shadow p-6 border">
        <h3 className="text-lg font-bold mb-2">{editingId ? "Editar integración" : "Agregar integración"}</h3>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <label className="block mb-2 font-semibold">Plataforma</label>
        <select className="w-full mb-4 p-2 border rounded" value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="">Selecciona plataforma...</option>
          {recommendedPlatforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <label className="block mb-2 font-semibold">API Key</label>
        <input type="text" value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <label className="block mb-2 font-semibold">Settings (JSON)</label>
        <textarea value={settings} onChange={e => setSettings(e.target.value)} className="w-full mb-4 p-2 border rounded" rows={4} />
        <button className="bg-blue-600 text-white px-6 py-2 rounded font-bold" onClick={handleSave} disabled={loading}>
          {editingId ? "Guardar cambios" : "Agregar integración"}
        </button>
        {editingId && (
          <button className="ml-4 px-6 py-2 rounded font-bold border" onClick={() => { setEditingId(null); setSelected(""); setApiKey(""); setSettings(""); }}>Cancelar</button>
        )}
      </div>
    </div>
  );
}
