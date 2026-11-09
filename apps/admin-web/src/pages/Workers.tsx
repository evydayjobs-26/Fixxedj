import { useEffect, useState } from "react";
import { adminApi } from "@/api/client";

type Worker = { id: string; phone: string; full_name?: string; is_active: boolean; is_verified: boolean };

export default function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get("/admin/users").then(({ data }) => {
      setWorkers(data.filter((u: Worker & { role: string }) => u.role === "worker"));
    }).finally(() => setLoading(false));
  }, []);

  const toggleActive = async (id: string) => {
    await adminApi.patch(`/admin/users/${id}/toggle-active`);
    setWorkers((prev) =>
      prev.map((w) => w.id === id ? { ...w, is_active: !w.is_active } : w)
    );
  };

  return (
    <div>
      <h2 style={styles.heading}>Workers</h2>
      {loading ? <p>Loading…</p> : (
        <table style={styles.table}>
          <thead>
            <tr>{["Name", "Phone", "Verified", "Active", "Actions"].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w.id} style={styles.tr}>
                <td style={styles.td}>{w.full_name ?? "—"}</td>
                <td style={styles.td}>{w.phone}</td>
                <td style={styles.td}>{w.is_verified ? "✅" : "❌"}</td>
                <td style={styles.td}>{w.is_active ? "✅" : "❌"}</td>
                <td style={styles.td}>
                  <button style={styles.btn} onClick={() => toggleActive(w.id)}>
                    {w.is_active ? "Deactivate" : "Activate"}
                  </button>
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
  btn: { background: "#FF6B2C", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 },
};
