import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      login(res.data.token, res.data.userId);
      navigate("/");
    } catch {
      setError("Ungültige E-Mail oder Passwort.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Anmelden</h2>
        <p className="text-gray-400 text-sm mb-6">Willkommen zurück!</p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
          />
          <button
            onClick={handleLogin}
            className="bg-green-400 text-gray-950 font-semibold py-3 rounded-xl hover:opacity-80 transition"
          >
            Anmelden
          </button>
        </div>

        <p className="text-gray-400 text-sm text-center mt-6">
          Noch kein Konto?{" "}
          <Link to="/register" className="text-green-400 hover:underline">
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;