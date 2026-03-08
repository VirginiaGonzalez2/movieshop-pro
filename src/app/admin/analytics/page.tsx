import Link from "next/link";
import { BarChart2 } from "lucide-react";

export default function AnalyticsAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Analítica & GTM</h2>
        <p className="text-sm text-muted-foreground">
          Conecta Google Analytics, Google Tag Manager y visualiza datos de analítica.
        </p>
      </div>
      <div className="grid gap-4">
        <Link
          href="/admin/analytics/config"
          className="group rounded-xl border bg-card p-5 transition hover:bg-muted/30"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg border bg-background flex items-center justify-center">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">Configurar IDs de Analítica</div>
              <div className="text-sm text-muted-foreground">
                Gestiona Google Analytics y GTM.
              </div>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/analytics/view"
          className="group rounded-xl border bg-card p-5 transition hover:bg-muted/30"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg border bg-background flex items-center justify-center">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">Ver Analítica</div>
              <div className="text-sm text-muted-foreground">
                Visualiza datos de Google Analytics.
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
