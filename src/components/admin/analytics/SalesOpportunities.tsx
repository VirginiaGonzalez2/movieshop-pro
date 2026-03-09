import React from "react";

interface SalesOpportunitiesProps {
  opportunities: Array<{
    title: string;
    views: number;
    purchases: number;
    opportunity: string;
  }>;
}

export function SalesOpportunities({ opportunities }: SalesOpportunitiesProps) {
  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <div className="font-bold mb-2">Sales Opportunities</div>
      {opportunities.length === 0 ? (
        <div>No opportunities found.</div>
      ) : (
        <ul>
          {opportunities.map((o, idx) => (
            <li key={idx} className="mb-2">
              <span className="font-semibold">⚠ Product "{o.title}"</span><br />
              Views: {o.views} | Purchases: {o.purchases}<br />
              <span className="text-yellow-700">Opportunity: {o.opportunity}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
