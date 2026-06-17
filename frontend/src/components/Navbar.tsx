import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const accent = "#00aaff";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Kalender" },
    { path: "/abfall-abc", label: "Abfall-ABC" },
    { path: "/map", label: "Karte" },
    { path: "/chat", label: "KI-Chat" },
    ...(isAuthenticated ? [{ path: "/profile", label: "Profil" }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="px-4 sm:px-6 py-4" style={{
      background: "linear-gradient(to bottom, #060B15 0%, #0a1628 100%)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(0,170,255,0.2)",
    }}>
      <div className="flex items-center justify-between w-full">
        <Link to="/" className="text-white font-bold text-xl">
          Müll<span style={{ color: accent }}>Kalender</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path} className="text-sm transition"
              style={{ color: isActive(path) ? accent : "rgba(255,255,255,0.5)" }}>
              {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-sm transition"
              style={{ color: "rgba(255,255,255,0.5)" }}>
              Abmelden
            </button>
          ) : (
            <Link to="/login" className="font-semibold px-4 py-2 rounded-lg text-sm transition"
              style={{ background: accent, color: "#060b13" }}>
              Anmelden
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden text-lg transition"
          style={{ color: "rgba(255,255,255,0.6)" }}
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col items-end gap-4 pt-4 pb-2 mt-4"
          style={{ borderTop: "1px solid rgba(0,170,255,0.15)" }}>
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path} className="text-sm transition"
              style={{ color: isActive(path) ? accent : "rgba(255,255,255,0.5)" }}
              onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="text-sm transition"
              style={{ color: "rgba(255,255,255,0.5)" }}>
              Abmelden
            </button>
          ) : (
            <Link to="/login"
              className="font-semibold px-4 py-2 rounded-lg text-sm transition"
              style={{ background: accent, color: "#060b13" }}
              onClick={() => setMenuOpen(false)}>
              Anmelden
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;