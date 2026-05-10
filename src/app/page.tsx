"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f && f.type === "application/pdf") {
      setFile(f);
      setMessages([{ role: "assistant", text: `"${f.name}" uploaded. Ask me anything about it!` }]);
    }
  }

  async function handleSend() {
    if (!input.trim() || !file || loading) return;
    const q = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("question", q);
      const res = await fetch("/api/chat", { method: "POST", body: formData });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.answer ?? "No answer returned." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Error contacting the server." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>PDF Chat</h1>
      <p style={{ color: "#888", marginBottom: 20, fontSize: 14 }}>Upload a PDF and ask questions about its content.</p>

      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: "2px dashed #333",
          borderRadius: 12,
          padding: "32px 16px",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 20,
          background: file ? "#1a1a2e" : "#141414",
          transition: "background 0.2s",
        }}
      >
        <input ref={fileRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={handleFile} />
        {file ? (
          <span style={{ color: "#7c6af7" }}>📄 {file.name}</span>
        ) : (
          <span style={{ color: "#555" }}>Click to upload a PDF</span>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#7c6af7" : "#1e1e1e",
              borderRadius: 12,
              padding: "10px 14px",
              maxWidth: "80%",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", color: "#555", fontSize: 13 }}>Thinking...</div>
        )}
        {!file && messages.length === 0 && (
          <div style={{ color: "#333", textAlign: "center", marginTop: 40, fontSize: 14 }}>
            Upload a PDF to get started
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={file ? "Ask a question..." : "Upload a PDF first"}
          disabled={!file || loading}
          style={{
            flex: 1,
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 8,
            padding: "10px 14px",
            color: "#f0f0f0",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || !file || loading}
          style={{
            background: "#7c6af7",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            opacity: !input.trim() || !file || loading ? 0.4 : 1,
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}
