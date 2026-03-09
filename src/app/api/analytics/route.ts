// Endpoint para geolocalización de usuarios
export async function PUT(req: Request) {
  if (!GA_VIEW_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    return NextResponse.json({ error: "Faltan credenciales de Google Analytics" }, { status: 400 });
  }

  const { startDate = "7daysAgo", endDate = "today" } = await req.json();

  const jwt = new google.auth.JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"]
  });
  const analytics = google.analytics({ version: "v3", auth: jwt });

  try {
    const response = await analytics.data.ga.get({
      "ids": `ga:${GA_VIEW_ID}`,
      "start-date": startDate,
      "end-date": endDate,
      "metrics": "ga:users",
      "dimensions": "ga:country,ga:city",
      "sort": "-ga:users",
      "max-results": 20
    });
    const rows = response.data.rows || [];
    const geo = rows.map(([country, city, users]) => ({
      country,
      city,
      users: Number(users)
    }));
    return NextResponse.json({ geo });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// Endpoint para páginas más visitadas
export async function POST(req: Request) {
  if (!GA_VIEW_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    return NextResponse.json({ error: "Faltan credenciales de Google Analytics" }, { status: 400 });
  }

  const { startDate = "7daysAgo", endDate = "today" } = await req.json();

  const jwt = new google.auth.JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"]
  });
  const analytics = google.analytics({ version: "v3", auth: jwt });

  try {
    const response = await analytics.data.ga.get({
      "ids": `ga:${GA_VIEW_ID}`,
      "start-date": startDate,
      "end-date": endDate,
      "metrics": "ga:pageviews,ga:transactionRevenue,ga:transactions",
      "dimensions": "ga:pagePath",
      "sort": "-ga:transactionRevenue",
      "max-results": 10
    });
    const rows = response.data.rows || [];
    const pages = rows.map(([pagePath, pageviews, revenue, transactions]) => ({
      pagePath,
      pageviews: Number(pageviews),
      revenue: Number(revenue),
      transactions: Number(transactions)
    }));
    return NextResponse.json({ pages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { google } from "googleapis";

// Reemplaza estos valores por los de tu cuenta de servicio
const GA_VIEW_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || "";
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";

export async function GET() {
  try {
    const analytics = {
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

    return NextResponse.json(analytics);

  } catch (error) {
    console.error("Analytics API error:", error);

    return NextResponse.json({
      users: 0,
      sessions: 0,
      pageviews: 0,
      revenue: 0,
      transactions: 0,
      conversionRate: 0,
      sessionsChart: [],
      topProducts: [],
      topPages: []
    });
  }
}
