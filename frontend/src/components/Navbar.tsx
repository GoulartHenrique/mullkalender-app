import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "text-green-400" : "text-gray-400 hover:text-white";

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-white font-bold text-xl">
        Müll<span className="text-green-400">Kalender</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className={`${isActive("/")} text-sm transition`}>
          Kalender
        </Link>
        <Link to="/chat" className={`${isActive("/chat")} text-sm transition`}>
          KI-Chat
        </Link>

        {isAuthenticated ? (
          <button
            onClick={logout}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            Abmelden
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-green-400 text-gray-950 font-semibold px-4 py-2 rounded-lg text-sm hover:opacity-80 transition"
          >
            Anmelden
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;