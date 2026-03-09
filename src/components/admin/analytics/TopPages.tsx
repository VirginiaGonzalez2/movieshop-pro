import React from "react";

interface TopPagesProps {
  pages: Array<{
    path: string;
    pageviews: number;
    revenue: number;
  }>;
}

export function TopPages({ pages }: TopPagesProps) {
  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <div className="font-bold mb-2">Top Pages</div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Page Path</th>
            <th>Pageviews</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((p, idx) => (
            <tr key={idx}>
              <td>{p.path}</td>
              <td>{p.pageviews}</td>
              <td>${p.revenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
