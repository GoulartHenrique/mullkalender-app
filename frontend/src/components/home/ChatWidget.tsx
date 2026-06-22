import { useState, useRef, useEffect } from "react";
import { Bot } from "lucide-react";
import api from "../../services/api";
import { useLanguage } from "../../languages/LanguageContext";

interface Message {
  role: "user" | "ai";
  content: string;
}

function ChatWidget() {
  const { t, language } = useLanguage();
  const suggestions = t<string[]>("home.suggestions");

  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: t("home.chatGreeting") }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // If the language changes and the chat only has the greeting, update
  // it. If a real conversation is happening, leave it alone.
  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0].role === "ai"
        ? [{ role: "ai", content: t("home.chatGreeting") }]
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
    const message = text ?? chatInput;
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await api.post("/api/ai/chat", { message, language });
      setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: t("home.chatError") }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      const mimeType = file.type;
      setMessages((prev) => [...prev, { role: "user", content: t("home.photoSent") }]);
      setChatLoading(true);
      try {
        const res = await api.post("/api/ai/photo", { image: base64, mimeType, language });
        setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
      } catch {
        setMessages((prev) => [...prev, { role: "ai", content: t("home.chatError") }]);
      } finally {
        setChatLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-3 px-4 sm:px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <Bot size={18} color="var(--accent)" />
        </div>
        <div>
          <p className="font-semibold text-sm">{t("home.botName")}</p>
          <p className="text-xs" style={{ color: "var(--accent)" }}>{t("home.botSubtitle")}</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full"
          style={{ background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />
      </div>

      <div className="px-4 sm:px-5 py-4 flex flex-col gap-3 max-h-72 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[85%] sm:max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
              style={msg.role === "user"
                ? { background: "var(--accent)", color: "var(--accent-bg)", fontWeight: 600, borderBottomRightRadius: 4 }
                : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderBottomLeftRadius: 4 }
              }>
              {msg.content}
            </div>
          </div>
        ))}
        {chatLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-2.5 rounded-2xl text-sm animate-pulse"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
              {t("home.processing")}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 sm:px-5 pb-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} onClick={() => handleSend(s)}
              className="text-xs px-3 py-1.5 rounded-xl transition"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="px-3 sm:px-4 py-3 flex gap-2 sm:gap-3 items-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <label className="cursor-pointer text-xl shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>
          📷
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </label>
        <input
          type="text"
          placeholder={t("home.chatPlaceholder")}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleChatKeyDown}
          className="glass-input flex-1 rounded-xl px-3 sm:px-4 py-2.5 text-white text-sm focus:outline-none"
        />
        <button onClick={() => handleSend()} disabled={chatLoading}
          className="font-bold px-3 sm:px-4 py-2.5 rounded-xl transition shrink-0 disabled:opacity-50"
          style={{ background: "var(--accent)", color: "var(--accent-bg)" }}>
          →
        </button>
      </div>
    </div>
  );
}

export default ChatWidget;