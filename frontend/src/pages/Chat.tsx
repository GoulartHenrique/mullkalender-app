import { useState, useRef, useEffect } from "react";
import { Bot } from "lucide-react";
import api from "../services/api";
import { useLanguage } from "../languages/LanguageContext";

interface Message {
  role: "user" | "ai";
  content: string;
}

function Chat() {
  const { t, language } = useLanguage();
  const suggestions = t<string[]>("chat.suggestions");

  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: t("chat.greeting") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // If the language changes and the chat only has the greeting, update
  // it. If a real conversation is happening, leave it alone.
  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0].role === "ai"
        ? [{ role: "ai", content: t("chat.greeting") }]
        : prev
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    if (messages.length > 1) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const message = text ?? input;
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/api/ai/chat", { message, language });
      setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: t("chat.error") }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="page-background min-h-screen text-white relative overflow-hidden flex flex-col">
      <div className="page-overlay" />

      <div className="relative max-w-2xl w-full mx-auto flex flex-col flex-1 px-4 py-8">

        <div className="flex flex-col flex-1 rounded-2xl overflow-hidden" style={{
          background: "rgba(20, 30, 45, 0.4)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <Bot size={20} color="var(--accent)" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">{t("chat.botName")}</h2>
              <p className="text-xs" style={{ color: "var(--accent)" }}>{t("chat.botSubtitle")}</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full"
              style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }} />
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-4 p-5 overflow-y-auto flex-1 min-h-75">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={
                  msg.role === "user"
                    ? "max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    : "bg-subtle max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed"
                }
                  style={msg.role === "user"
                    ? { background: "var(--accent)", color: "var(--accent-bg)", fontWeight: 600, borderBottomRightRadius: 4 }
                    : { borderBottomLeftRadius: 4 }
                  }>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-subtle text-faint px-4 py-3 rounded-2xl text-sm animate-pulse">
                  {t("chat.processing")}
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
                  className="text-secondary text-xs px-3 py-2 rounded-xl transition"
                  style={{ background: "rgba(0,170,255,0.08)", border: "1px solid rgba(0,170,255,0.2)" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-3 px-4 py-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <input
              type="text"
              placeholder={t("chat.inputPlaceholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-subtle flex-1 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
            />
            <button onClick={() => handleSend()} disabled={loading}
              className="font-bold px-5 py-3 rounded-xl transition disabled:opacity-50"
              style={{ background: "var(--accent)", color: "var(--accent-bg)" }}>
              →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Chat;