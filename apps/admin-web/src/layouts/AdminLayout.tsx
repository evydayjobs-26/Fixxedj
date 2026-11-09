import { NavLink, Outlet, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Workers",   to: "/workers" },
  { label: "Customers", to: "/customers" },
  { label: "Bookings",  to: "/bookings" },
  { label: "Services",  to: "/services" },
  { label: "Payments",  to: "/payments" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>⚡ Fixxedj</div>
        <nav>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...styles.navItem,
                background: isActive ? "#FF6B2C" : "transparent",
                color: isActive ? "#fff" : "#cbd5e1",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: "flex", minHeight: "100vh" },
  sidebar: {
    width: 220,
    background: "#1e293b",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  logo: { color: "#FF6B2C", fontSize: 20, fontWeight: 700, padding: "0 20px 24px" },
  navItem: {
    display: "block",
    padding: "10px 20px",
    textDecoration: "none",
    borderRadius: 8,
    margin: "2px 8px",
    fontSize: 14,
    fontWeight: 500,
    transition: "background 0.15s",
  },
  logoutBtn: {
    marginTop: "auto",
    marginLeft: 8,
    marginRight: 8,
    padding: "10px 20px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  main: { flex: 1, padding: 32, overflowY: "auto" },
};
