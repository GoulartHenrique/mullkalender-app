import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../languages/LanguageContext";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: t("navbar.calendar") },
    { path: "/abfall-abc", label: t("navbar.abfallABC") },
    { path: "/map", label: t("navbar.map") },
    { path: "/chat", label: t("navbar.chat") },
    ...(isAuthenticated ? [{ path: "/profile", label: t("navbar.profile") }] : []),
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
          Müll<span style={{ color: "var(--accent)" }}>Kalender</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path} className="text-sm transition"
              style={{ color: isActive(path) ? "var(--accent)" : "var(--text-muted)" }}>
              {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-muted text-sm transition">
              {t("navbar.logout")}
            </button>
          ) : (
            <Link to="/login" className="font-semibold px-4 py-2 rounded-lg text-sm transition"
              style={{ background: "var(--accent)", color: "var(--accent-bg)" }}>
              {t("navbar.login")}
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="text-tertiary sm:hidden text-lg transition"
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
              style={{ color: isActive(path) ? "var(--accent)" : "var(--text-muted)" }}
              onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="text-muted text-sm transition">
              {t("navbar.logout")}
            </button>
          ) : (
            <Link to="/login"
              className="font-semibold px-4 py-2 rounded-lg text-sm transition"
              style={{ background: "var(--accent)", color: "var(--accent-bg)" }}
              onClick={() => setMenuOpen(false)}>
              {t("navbar.login")}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;