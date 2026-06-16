import { useState, useRef, useEffect } from "react";
import { Bot } from "lucide-react";
import api from "../services/api";

interface Message {
  role: "user" | "ai";
  content: string;
}

const accent = "#00aaff";

const suggestions = [
  "Wo kommt eine Batterie rein?",
  "Ist Pizzakarton Papiertonne?",
  "Was gehört in den Gelben Sack?",
  "Wo entsorge ich Medikamente?",
];

function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hallo! Ich helfe Ihnen bei Fragen zur Mülltrennung in Erfurt. Was möchten Sie wissen? 🗑️" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const message = text ?? input;
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/api/ai/chat", { message });
      setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "Es gab einen Fehler. Bitte versuchen Sie es erneut." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col" style={{
      backgroundImage: "url('/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(6,11,19,0.65) 0%, rgba(6,11,19,0.45) 50%, rgba(6,11,19,0.75) 100%)"
      }} />

      <div className="relative max-w-2xl w-full mx-auto flex flex-col flex-1 px-4 py-8">

        <div className="flex flex-col flex-1 rounded-2xl overflow-hidden" style={{
          background: "rgba(20, 30, 45, 0.4)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <Bot size={20} color={accent} />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">MüllBot</h2>
              <p className="text-xs" style={{ color: accent }}>KI-Assistent · Erfurt</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full"
              style={{ background: accent, boxShadow: `0 0 6px ${accent}` }} />
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-4 p-5 overflow-y-auto flex-1 min-h-[300px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={msg.role === "user"
                    ? { background: accent, color: "#060b13", fontWeight: 600, borderBottomRightRadius: 4 }
                    : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderBottomLeftRadius: 4 }
                  }>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl text-sm animate-pulse"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                  Wird bearbeitet...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => handleSend(s)}
                  className="text-xs px-3 py-2 rounded-xl transition"
                  style={{ background: "rgba(0,170,255,0.08)", border: "1px solid rgba(0,170,255,0.2)", color: "rgba(255,255,255,0.7)" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-3 px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <input
              type="text"
              placeholder="Stellen Sie eine Frage zur Mülltrennung..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <button onClick={() => handleSend()} disabled={loading}
              className="font-bold px-5 py-3 rounded-xl transition disabled:opacity-50"
              style={{ background: accent, color: "#060b13" }}>
              →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Chat;