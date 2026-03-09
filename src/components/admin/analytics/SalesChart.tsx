"use client";
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SalesChartProps {
  data: Array<{
    date: string;
    sessions: number;
    revenue: number;
    transactions: number;
  }>;
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <div className="font-bold mb-2">Sales Trend</div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sessions" stroke="#8884d8" name="Sessions" />
          <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
          <Line type="monotone" dataKey="transactions" stroke="#ffc658" name="Transactions" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
