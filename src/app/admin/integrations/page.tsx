import { AVAILABLE_INTEGRATIONS } from "@/services/integrations/integrations.catalog";
import { AvailableIntegrationsList } from "./AvailableIntegrationsList";

interface ConfiguredIntegration {
  platform: string;
  createdAt: string;
}

interface ConfiguredIntegrationsProps {
  integrations: ConfiguredIntegration[];
}

function ConfiguredIntegrations({ integrations }: ConfiguredIntegrationsProps) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-2">Configured Integrations</h3>

      {integrations.length === 0 ? (
        <div className="text-gray-500 mb-6">
          No integrations configured yet.
        </div>
      ) : (
        <ul className="mt-2 mb-6">
          {integrations.map((integration) => (
            <li key={integration.platform} className="mb-2 border-b pb-2">
              <div>
                <span className="font-semibold">Platform:</span> {integration.platform}
              </div>
              <div>
                <span className="font-semibold">Created At:</span> {integration.createdAt}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default async function IntegrationsAdminPage() {
  let integrations = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/integrations`, {
      cache: "no-store"
    });

    if (res.ok) {
      integrations = await res.json();
    }

  } catch {
    integrations = [];
  }

  return (
    <div className="max-w-2xl mx-auto p-6">

      <h2 className="text-2xl font-bold mb-4">
        Integrations Admin
      </h2>

      <ConfiguredIntegrations integrations={integrations} />

      <h3 className="text-xl font-semibold mt-6 mb-2">
        Available Integrations
      </h3>

      <AvailableIntegrationsList integrations={AVAILABLE_INTEGRATIONS} />

    </div>
  );
}