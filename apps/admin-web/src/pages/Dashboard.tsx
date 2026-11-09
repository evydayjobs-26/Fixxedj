import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { adminApi } from "@/api/client";

type Stats = { total_users: number; total_bookings: number; total_revenue_inr: number };

const MOCK_CHART = [
  { month: "Jun", revenue: 42000 },
  { month: "Jul", revenue: 58000 },
  { month: "Aug", revenue: 51000 },
  { month: "Sep", revenue: 72000 },
  { month: "Oct", revenue: 89000 },
  { month: "Nov", revenue: 63000 },
];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminApi.get("/admin/stats").then(({ data }) => setStats(data)).catch(() =>
      setStats({ total_users: 0, total_bookings: 0, total_revenue_inr: 0 })
    );
  }, []);

  return (
    <div>
      <h2 style={styles.heading}>Dashboard</h2>

      <div style={styles.cards}>
        <StatCard label="Total Users" value={stats?.total_users ?? "—"} color="#3b82f6" />
        <StatCard label="Total Bookings" value={stats?.total_bookings ?? "—"} color="#10b981" />
        <StatCard label="Revenue (INR)" value={stats ? `₹${stats.total_revenue_inr.toLocaleString()}` : "—"} color="#FF6B2C" />
      </div>

      <div style={styles.chartBox}>
        <h3 style={styles.chartTitle}>Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={MOCK_CHART}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
            <Bar dataKey="revenue" fill="#FF6B2C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <p style={styles.cardLabel}>{label}</p>
      <p style={styles.cardValue}>{value}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heading: { fontSize: 22, fontWeight: 700, marginBottom: 24 },
  cards: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 },
  card: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" },
  cardLabel: { fontSize: 13, color: "#64748b", marginBottom: 8 },
  cardValue: { fontSize: 28, fontWeight: 700, color: "#1e293b" },
  chartBox: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" },
  chartTitle: { fontSize: 16, fontWeight: 600, marginBottom: 16 },
};
