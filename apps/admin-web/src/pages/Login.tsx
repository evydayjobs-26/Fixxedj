import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/api/client";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // In production wire this up to a real admin auth endpoint
      const { data } = await adminApi.post("/auth/token", null, {
        params: { phone: email },
      });
      localStorage.setItem("admin_token", data.access_token);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleLogin}>
        <h1 style={styles.title}>Fixxedj Admin</h1>
        <p style={styles.subtitle}>Sign in to your admin account</p>

        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label}>Email / Phone</label>
        <input
          style={styles.input}
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@fixxedj.com"
          required
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f1f5f9" },
  card: { background: "#fff", borderRadius: 16, padding: 40, width: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
  title: { fontSize: 24, fontWeight: 700, color: "#FF6B2C", marginBottom: 4 },
  subtitle: { color: "#64748b", marginBottom: 24 },
  error: { background: "#fef2f2", color: "#ef4444", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 14 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 6 },
  input: { width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, marginBottom: 16 },
  button: { width: "100%", background: "#FF6B2C", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontSize: 15, fontWeight: 600, cursor: "pointer" },
};
