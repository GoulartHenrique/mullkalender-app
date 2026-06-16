const accent = "#00aaff";

function AbfallABC() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center" style={{
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(6,11,19,0.65) 0%, rgba(6,11,19,0.45) 50%, rgba(6,11,19,0.75) 100%)"
      }} />

      <div className="relative text-center p-8 rounded-2xl" style={{
        background: "rgba(20, 30, 45, 0.4)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <p className="text-4xl mb-4">🚧</p>
        <h2 className="text-xl font-bold mb-2">Abfall-ABC</h2>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Kommt bald...</p>
      </div>
    </div>
  );
}

export default AbfallABC;