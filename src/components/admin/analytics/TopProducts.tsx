import React from "react";

interface TopProductsProps {
  products: Array<{
    title: string;
    unitsSold: number;
    revenue: number;
    views: number;
    purchases: number;
  }>;
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <div className="font-bold mb-2">Top Selling Products</div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Movie Title</th>
            <th>Units Sold</th>
            <th>Revenue</th>
            <th>Views</th>
            <th>Purchases</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={idx}>
              <td>{p.title}</td>
              <td>{p.unitsSold}</td>
              <td>${p.revenue.toFixed(2)}</td>
              <td>{p.views}</td>
              <td>{p.purchases}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
