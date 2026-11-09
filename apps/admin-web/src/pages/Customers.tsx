import { useEffect, useState } from "react";
import { adminApi } from "@/api/client";

type Customer = { id: string; phone: string; full_name?: string; is_active: boolean };

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get("/admin/users").then(({ data }) => {
      setCustomers(data.filter((u: Customer & { role: string }) => u.role === "customer"));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={styles.heading}>Customers</h2>
      {loading ? <p>Loading…</p> : (
        <table style={styles.table}>
          <thead>
            <tr>{["Name", "Phone", "Status"].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} style={styles.tr}>
                <td style={styles.td}>{c.full_name ?? "—"}</td>
                <td style={styles.td}>{c.phone}</td>
                <td style={styles.td}>
                  <span style={{ color: c.is_active ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
                    {c.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
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
