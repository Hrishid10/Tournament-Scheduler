import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (active) => ({
    padding: "10px 14px",
    borderRadius: "9px",
    textDecoration: "none",
    fontWeight: "500",
    color: active ? "white" : "black",
    background: active ? "blue" : "transparent",
  });

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "white",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "30px" }}>🏆</span>
          <h2 style={{ margin: 0, fontSize: "22px" }}>Tournament Management</h2>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/" style={linkStyle(isActive("/"))}>
            Public View
          </Link>

          <Link to="/admin" style={linkStyle(isActive("/admin"))}>
            Admin Panel
          </Link>
        </div>
      </div>
    </nav>
  );
}
