import Link from "next/link";
import { BarChart2 } from "lucide-react";

export default function AnalyticsAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Analytics & GTM</h2>
        <p className="text-sm text-muted-foreground">
          Professional control center for Google Analytics, Google Tag Manager, and ecommerce insights.
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
              <div className="font-semibold">Configure Analytics IDs</div>
              <div className="text-sm text-muted-foreground">
                Manage Google Analytics and Google Tag Manager IDs.
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
              <div className="font-semibold">View Analytics Dashboard</div>
              <div className="text-sm text-muted-foreground">
                Visualize ecommerce sales insights and opportunities.
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
