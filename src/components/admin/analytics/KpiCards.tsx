import React from "react";

interface KpiCardsProps {
  users: number;
  sessions: number;
  transactions: number;
  revenue: number;
  conversionRate: number;
}

export function KpiCards({ users, sessions, transactions, revenue, conversionRate }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      <div className="bg-white shadow rounded p-4 text-center">
        <div className="text-lg font-bold">Users</div>
        <div className="text-2xl">{users}</div>
      </div>
      <div className="bg-white shadow rounded p-4 text-center">
        <div className="text-lg font-bold">Sessions</div>
        <div className="text-2xl">{sessions}</div>
      </div>
      <div className="bg-white shadow rounded p-4 text-center">
        <div className="text-lg font-bold">Transactions</div>
        <div className="text-2xl">{transactions}</div>
      </div>
      <div className="bg-white shadow rounded p-4 text-center">
        <div className="text-lg font-bold">Revenue</div>
        <div className="text-2xl">${revenue.toFixed(2)}</div>
      </div>
      <div className="bg-white shadow rounded p-4 text-center">
        <div className="text-lg font-bold">Conversion Rate</div>
        <div className="text-2xl">{conversionRate}%</div>
      </div>
    </div>
  );
}
