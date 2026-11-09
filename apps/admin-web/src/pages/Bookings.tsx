import { useEffect, useState } from "react";
import { adminApi } from "@/api/client";

type Booking = { id: string; status: string; address: string; scheduled_at: string; total_amount: number };

const STATUS_COLOR: Record<string, string> = {
  pending: "#f59e0b",
  accepted: "#3b82f6",
  en_route: "#6366f1",
  in_progress: "#10b981",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get("/admin/bookings").then(({ data }) => setBookings(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={styles.heading}>Bookings</h2>
      {loading ? <p>Loading…</p> : (
        <table style={styles.table}>
          <thead>
            <tr>{["ID", "Address", "Scheduled", "Status", "Amount"].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} style={styles.tr}>
                <td style={styles.td}>{b.id.slice(0, 8)}…</td>
                <td style={styles.td}>{b.address}</td>
                <td style={styles.td}>{new Date(b.scheduled_at).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <span style={{ background: STATUS_COLOR[b.status] || "#888", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 600 }}>
                    {b.status}
                  </span>
                </td>
                <td style={styles.td}>₹{b.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heading: { fontSize: 22, fontWeight: 700, marginBottom: 24 },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" },
  th: { textAlign: "left", padding: "12px 16px", background: "#f8fafc", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 16px", fontSize: 14, color: "#1e293b" },
};
