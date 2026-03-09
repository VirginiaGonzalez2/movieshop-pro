
import { KpiCards } from "@/components/admin/analytics/KpiCards";
import { SalesChart } from "@/components/admin/analytics/SalesChart";
import { TopProducts } from "@/components/admin/analytics/TopProducts";
import { TopPages } from "@/components/admin/analytics/TopPages";
import { SalesOpportunities } from "@/components/admin/analytics/SalesOpportunities";

export const dynamic = "force-dynamic";

async function fetchAnalytics(baseUrl: string) {
  const res = await fetch(`${baseUrl}/api/analytics`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load analytics");
  return await res.json();
}

export default async function AnalyticsDashboardPage() {
  // Fetch analytics config
  const configRes = await fetch("http://localhost:3000/api/analytics/config", { cache: "no-store" });
  const config = await configRes.json();

  let data;
  try {
    const res = await fetch("http://localhost:3000/api/analytics", { cache: "no-store" });
    if (!res.ok) throw new Error("Analytics API error");
    data = await res.json();
  } catch (error) {
    data = null;
  }

  const safeData = data ?? {
    users: 0,
    sessions: 0,
    pageviews: 0,
    revenue: 0,
    transactions: 0,
    conversionRate: 0,
    sessionsChart: [],
    topProducts: [],
    topPages: []
  };

  // Calculate sales opportunities
  const opportunities = (safeData.topProducts || [])
    .filter(p => p.views > 100 && p.purchases / p.views < 0.02)
    .map(p => ({
      title: p.title,
      views: p.views,
      purchases: p.purchases,
      opportunity: "Improve product page conversion."
    }));

  // Always render dashboard, show fallback message if GA is not configured
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      {!config?.gaId && (
        <div className="bg-white rounded shadow p-6 text-center text-muted-foreground mb-6">
          <h2 className="text-lg font-semibold mb-2">No analytics data yet.</h2>
          <p>Configure Google Analytics to start tracking.</p>
        </div>
      )}
      <KpiCards
        users={safeData.users}
        sessions={safeData.sessions}
        transactions={safeData.transactions}
        revenue={safeData.revenue}
        conversionRate={safeData.conversionRate}
      />
      <SalesChart data={safeData.sessionsChart} />
      <TopProducts products={safeData.topProducts} />
      <TopPages pages={safeData.topPages} />
      <SalesOpportunities opportunities={opportunities} />
    </div>
  );
}
