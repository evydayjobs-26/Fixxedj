import { useEffect, useState } from "react";
import { adminApi } from "@/api/client";

type Payment = { id: string; amount: number; currency: string; status: string; created_at: string };

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get("/payments/").then(({ data }) => setPayments(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={styles.heading}>Payments</h2>
      {loading ? <p>Loading…</p> : (
        <table style={styles.table}>
          <thead>
            <tr>{["ID", "Amount", "Currency", "Status", "Date"].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} style={styles.tr}>
                <td style={styles.td}>{p.id.slice(0, 8)}…</td>
                <td style={styles.td}>₹{p.amount.toLocaleString()}</td>
                <td style={styles.td}>{p.currency}</td>
                <td style={styles.td}>
                  <span style={{ color: p.status === "captured" ? "#22c55e" : p.status === "failed" ? "#ef4444" : "#f59e0b", fontWeight: 600, textTransform: "capitalize" }}>
                    {p.status}
                  </span>
                </td>
                <td style={styles.td}>{new Date(p.created_at).toLocaleDateString()}</td>
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
