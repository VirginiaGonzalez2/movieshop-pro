"use client";
import { useRef } from "react";
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dateRef = useRef<HTMLFormElement>(null);

  // Actualizar todos los fetch con fechas
  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPages();
    fetchGeo();
    // Puedes agregar más fetchs aquí si hay otros gráficos
  };
      {/* Filtros avanzados */}
      <form ref={dateRef} onSubmit={handleFilter} className="mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs mb-1">Fecha inicio</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Fecha fin</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Filtrar</button>
      </form>
import { Pie } from "react-chartjs-2";
  const [geo, setGeo] = useState<any[]>([]);
  const [geoLoading, setGeoLoading] = useState(true);

  const fetchGeo = useCallback(() => {
    setGeoLoading(true);
    fetch("/api/analytics", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: "7daysAgo", endDate: "today" })
    })
      .then(res => res.json())
      .then(d => {
        setGeo(d.geo || []);
        setGeoLoading(false);
      })
      .catch(() => setGeoLoading(false));
  }, []);

  useEffect(() => {
    fetchGeo();
  }, [fetchGeo]);
      {/* Gráfico de geolocalización de usuarios */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Usuarios por país y ciudad</h3>
        {geoLoading ? (
          <p className="text-muted-foreground">Cargando geolocalización...</p>
        ) : geo.length === 0 ? (
          <p className="text-muted-foreground">No hay datos disponibles.</p>
        ) : (
          <Pie
            data={{
              labels: geo.map(g => `${g.country} - ${g.city}`),
              datasets: [
                {
                  label: "Usuarios",
                  data: geo.map(g => g.users),
                  backgroundColor: [
                    "#3b82f6",
                    "#22c55e",
                    "#f59e42",
                    "#ef4444",
                    "#a21caf",
                    "#eab308",
                    "#0ea5e9",
                    "#f472b6",
                    "#10b981",
                    "#6366f1",
                    "#facc15",
                    "#f87171",
                    "#a3e635",
                    "#fbbf24",
                    "#d946ef",
                    "#14b8a6",
                    "#f43f5e",
                    "#e11d48",
                    "#7c3aed",
                    "#f3f4f6"
                  ]
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
                title: { display: true, text: "Distribución de usuarios por país y ciudad" }
              }
            }}
            height={300}
          />
        )}
      </div>
import { useMemo } from "react";
  const [selectedKPI, setSelectedKPI] = useState("revenue");

  const kpiOptions = useMemo(() => [
    { value: "revenue", label: "Ingresos" },
    { value: "sessions", label: "Sesiones" },
    { value: "users", label: "Usuarios" },
    { value: "transactions", label: "Transacciones" },
    { value: "pageviews", label: "Pageviews" },
    { value: "conversionRate", label: "Tasa de conversión" }
  ], []);
      {/* Selector de KPI */}
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm font-medium">KPI principal:</label>
        <select
          className="border rounded px-2 py-1"
          value={selectedKPI}
          onChange={e => setSelectedKPI(e.target.value)}
        >
          {kpiOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
import HeatMap from "react-heatmap-grid";
      {/* Mapa de calor de oportunidades por KPI */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Mapa de calor por página ({kpiOptions.find(opt => opt.value === selectedKPI)?.label})</h3>
        {pagesLoading ? (
          <p className="text-muted-foreground">Cargando mapa de calor...</p>
        ) : pages.length === 0 ? (
          <p className="text-muted-foreground">No hay datos disponibles.</p>
        ) : (
          <div className="overflow-x-auto">
            <HeatMap
              xLabels={pages.map(p => p.pagePath)}
              yLabels={[kpiOptions.find(opt => opt.value === selectedKPI)?.label || "KPI"]}
              data={[pages.map(p => p[selectedKPI])]} // KPI dinámico
              cellStyle={(background, value, min, max, data, x, y) => ({
                background: `rgba(34,197,94,${(value - min) / (max - min + 0.01)})`,
                color: value > (max - min) / 2 ? "#fff" : "#222",
                fontWeight: "bold",
                borderRadius: "4px"
              })}
              cellRender={value => selectedKPI === "revenue" ? `$${value}` : value}
              height={40}
              width={120}
            />
            <div className="text-xs text-muted-foreground mt-2">El color indica la oportunidad: más oscuro, mayor valor.</div>
          </div>
        )}
      </div>
import { useCallback } from "react";
  const [pages, setPages] = useState<any[]>([]);
  const [pagesLoading, setPagesLoading] = useState(true);

  const fetchPages = useCallback(() => {
    setPagesLoading(true);
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: "7daysAgo", endDate: "today" })
    })
      .then(res => res.json())
      .then(d => {
        setPages(d.pages || []);
        setPagesLoading(false);
      })
      .catch(() => setPagesLoading(false));
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);
      {/* KPIs destacados */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-primary/10 rounded p-3 text-center">
          <div className="text-xs text-primary">Ingresos últimos 7 días</div>
          <div className="text-2xl font-bold text-primary">${data.revenue}</div>
        </div>
        <div className="bg-blue-100 rounded p-3 text-center">
          <div className="text-xs text-blue-600">Sesiones</div>
          <div className="text-2xl font-bold text-blue-600">{data.sessions}</div>
        </div>
        <div className="bg-green-100 rounded p-3 text-center">
          <div className="text-xs text-green-600">Tasa de conversión</div>
          <div className="text-2xl font-bold text-green-600">{data.conversionRate}%</div>
        </div>
      </div>
      {/* Tabla de páginas más visitadas */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Páginas con mayor revenue</h3>
        {pagesLoading ? (
          <p className="text-muted-foreground">Cargando páginas...</p>
        ) : pages.length === 0 ? (
          <p className="text-muted-foreground">No hay datos disponibles.</p>
        ) : (
          <table className="w-full text-sm border rounded overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Página</th>
                <th className="p-2 text-right">Pageviews</th>
                <th className="p-2 text-right">Ingresos</th>
                <th className="p-2 text-right">Transacciones</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 text-left">{p.pagePath}</td>
                  <td className="p-2 text-right">{p.pageviews}</td>
                  <td className="p-2 text-right">${p.revenue}</td>
                  <td className="p-2 text-right">{p.transactions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
import { BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AnalyticsViewPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sessionsChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Sesiones por día" },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => `Sesiones: ${context.parsed.y}`
        }
      }
    }
  };
  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Ingresos por día" },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => `Ingresos: $${context.parsed.y}`
        }
      }
    }
  };
      {/* Tabla de tendencias y comparativas */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Tendencias y comparativas</h3>
        {data.sessionsChart && data.sessionsChart.length > 1 ? (
          <table className="w-full text-sm border rounded overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-right">Sesiones</th>
                <th className="p-2 text-right">Ingresos</th>
                <th className="p-2 text-right">Transacciones</th>
                <th className="p-2 text-right">Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {data.sessionsChart.map((d: any, idx: number) => {
                const prev = idx > 0 ? data.sessionsChart[idx - 1] : null;
                const trend = prev ? d.revenue > prev.revenue ? "↑" : d.revenue < prev.revenue ? "↓" : "→" : "-";
                return (
                  <tr key={d.date} className="border-t">
                    <td className="p-2 text-left">{d.date}</td>
                    <td className="p-2 text-right">{d.sessions}</td>
                    <td className="p-2 text-right">${d.revenue}</td>
                    <td className="p-2 text-right">{d.transactions}</td>
                    <td className="p-2 text-right text-lg">{trend}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-muted-foreground">No hay suficientes datos para comparar.</p>
        )}
      </div>

  const sessionsChartData = {
    labels: data.sessionsChart?.map((d: any) => d.date) || [],
    datasets: [
      {
        label: "Sesiones",
        data: data.sessionsChart?.map((d: any) => d.sessions) || [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4
      }
    ]
  };
  const revenueChartData = {
    labels: data.sessionsChart?.map((d: any) => d.date) || [],
    datasets: [
      {
        label: "Ingresos",
        data: data.sessionsChart?.map((d: any) => d.revenue) || [],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      <h2 className="text-xl font-semibold">Visualización de Analítica</h2>
      <div className="flex items-center gap-3">
        <BarChart2 className="h-8 w-8 text-primary" />
        <span className="text-lg">Datos de Google Analytics</span>
      </div>
      <div className="bg-muted rounded p-6 mt-4">
        {loading ? (
          <p className="text-muted-foreground">Cargando datos...</p>
        ) : data.error ? (
          <p className="text-red-500">Error: {data.error}</p>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-sm">Usuarios<br /><b>{data.users}</b></div>
              <div className="text-sm">Sesiones<br /><b>{data.sessions}</b></div>
              <div className="text-sm">Páginas vistas<br /><b>{data.pageviews}</b></div>
              <div className="text-sm">Transacciones<br /><b>{data.transactions}</b></div>
              <div className="text-sm">Ingresos<br /><b>${data.revenue}</b></div>
              <div className="text-sm">Tasa de conversión<br /><b>{data.conversionRate}%</b></div>
            </div>
            {data.sessionsChart && data.sessionsChart.length > 0 && (
              <>
                <Line options={sessionsChartOptions} data={sessionsChartData} height={300} />
                <Line options={revenueChartOptions} data={revenueChartData} height={300} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
