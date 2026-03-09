"use client";

import { useState } from "react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface AvailableIntegrationsListProps {
  integrations: Integration[];
  onConnect?: () => void;
}

export function AvailableIntegrationsList({ integrations, onConnect }: AvailableIntegrationsListProps) {
  const [openIntegration, setOpenIntegration] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [settings, setSettings] = useState("");

  const handleConnect = async () => {
    try {
      await fetch("/api/integrations/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          platform: openIntegration,
          apiKey,
          settings: settings ? JSON.parse(settings) : {}
        })
      });

      setOpenIntegration(null);
      setApiKey("");
      setSettings("");

      window.location.reload();
    } catch (error) {
      console.error("Integration failed", error);
    }
  };

  return (
    <div className="space-y-6">

      {integrations.map((integration: Integration) => (
        <div key={integration.id} className="border p-4 rounded">

          <h3 className="text-lg font-semibold">
            {integration.name}
          </h3>

          <p className="text-gray-600">
            {integration.description}
          </p>

          <p className="text-sm text-gray-400">
            Category: {integration.category}
          </p>

          <button
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setOpenIntegration(integration.id)}
          >
            Connect
          </button>

        </div>
      ))}

      {openIntegration && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">

          <div className="bg-white p-6 rounded shadow max-w-md w-full">

            <h2 className="text-xl font-semibold mb-4">
              Connect {openIntegration}
            </h2>

            <label className="block mb-3">
              API Key
              <input
                className="w-full border p-2 mt-1"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </label>

            <label className="block mb-3">
              Settings (JSON optional)
              <textarea
                className="w-full border p-2 mt-1"
                value={settings}
                onChange={(e) => setSettings(e.target.value)}
                rows={4}
                placeholder={`{
  "option": "value"
}`}
              />
            </label>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleConnect}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Connect
              </button>

              <button
                onClick={() => setOpenIntegration(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}