import React, { useState, useRef, useEffect } from "react";
import {
  FlaskConical, X, Lock, Globe, Info, CheckCircle2, AlertTriangle,
  XCircle, ArrowUpRight, ClipboardList, FileText, Loader2, type LucideIcon,
} from "lucide-react";
import { getLogoIcon } from "@/lib/logoIcons";
import { SA_THEME as T } from "../../data/theme";
import type { ManagedShop, IsolationLog } from "../../types/index";
import { Card, Btn, Input, SectionHeader, Badge } from "../layout/UI";
import { genId } from "../../utils/helpers";

interface Props {
  shops: ManagedShop[];
  preloadShop?: ManagedShop | null;
  addToast: (msg: string, type?: string) => void;
}

export function IsolationModule({ shops, preloadShop, addToast }: Props) {
  const [shopId, setShopId] = useState(preloadShop?.id ?? "");
  const [customUrl, setCustomUrl] = useState(preloadShop?.shopUrl ?? "");
  const [urlInput, setUrlInput] = useState(preloadShop?.shopUrl ?? "");
  const [loadMode, setLoadMode] = useState<"shop" | "admin" | "custom">("shop");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState<IsolationLog[]>([]);
  const [consoleInput, setConsoleInput] = useState("");
  const logEndRef = useRef<HTMLDivElement>(null);

  const selectedShop = shops.find(s => s.id === shopId);

  useEffect(() => {
    if (preloadShop) {
      setShopId(preloadShop.id);
      setUrlInput(preloadShop.shopUrl);
      setCustomUrl(preloadShop.shopUrl);
    }
  }, [preloadShop]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (type: IsolationLog["type"], message: string) => {
    setLogs(prev => [...prev, { id: genId("log"), timestamp: new Date().toISOString(), type, message }]);
  };

  const handleLoad = () => {
    setLoading(true);
    setLoaded(false);
    setLogs([]);

    let url = urlInput;
    if (shopId && selectedShop) {
      url = loadMode === "admin" ? selectedShop.adminUrl : selectedShop.shopUrl;
    }
    setCustomUrl(url);

    addLog("info", `Isolation session started for: ${url}`);
    addLog("info", `Load mode: ${loadMode}`);
    if (selectedShop) {
      addLog("info", `Shop: ${selectedShop.name} (${selectedShop.status})`);
      addLog("info", `Owner: ${selectedShop.ownerName} — ${selectedShop.ownerEmail}`);
    }

    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
      addLog("success", "Frame loaded successfully. Monitoring active.");
      addLog("info", "All interactions within this frame are isolated from production data.");
    }, 1400);
  };

  const handleClearSession = () => {
    setLoaded(false);
    setLogs([]);
    setNotes("");
    addToast("Isolation session cleared.", "info");
  };

  const handleConsoleSubmit = () => {
    if (!consoleInput.trim()) return;
    addLog("info", `> ${consoleInput}`);
    // Simulate a response
    const responses: Record<string, string> = {
      "ping": "pong — shop is responding",
      "status": `Shop status: ${selectedShop?.status ?? "unknown"}`,
      "products": `Product count: ${selectedShop?.totalProducts ?? "N/A"}`,
      "orders": `Total orders: ${selectedShop?.totalOrders ?? "N/A"}`,
      "help": "Commands: ping, status, products, orders, help",
    };
    const resp = responses[consoleInput.trim().toLowerCase()] ?? `Unknown command: "${consoleInput}". Type 'help' for available commands.`;
    setTimeout(() => addLog(responses[consoleInput.trim().toLowerCase()] ? "success" : "warning", resp), 300);
    setConsoleInput("");
  };

  const logColors: Record<IsolationLog["type"], string> = {
    info: T.textMuted,
    success: T.success,
    warning: T.warning,
    error: T.danger,
  };
  const logIcons: Record<IsolationLog["type"], LucideIcon> = {
    info: Info, success: CheckCircle2, warning: AlertTriangle, error: XCircle,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader
        icon={FlaskConical}
        title="Isolation Lab"
        subtitle="Load any shop or admin panel in a sandboxed view — troubleshoot without touching live data."
      />

      {/* ── Controls ── */}
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {/* Shop picker */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Select Registered Shop</label>
              <select value={shopId} onChange={e => {
                setShopId(e.target.value);
                const s = shops.find(sh => sh.id === e.target.value);
                if (s) setUrlInput(s.shopUrl);
              }} style={{ width: "100%", padding: "9px 12px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface }}>
                <option value="">— or enter a custom URL below —</option>
                {shops.map(s => <option key={s.id} value={s.id}>{s.name} ({s.status})</option>)}
              </select>
            </div>

            {/* Mode */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Load Mode</label>
              <select value={loadMode} onChange={e => setLoadMode(e.target.value as typeof loadMode)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface }}>
                <option value="shop">Customer-Facing Shop</option>
                <option value="admin">Shop Admin Panel</option>
                <option value="custom">Custom URL</option>
              </select>
            </div>
          </div>

          {/* URL input */}
          <Input
            label={loadMode === "custom" ? "Custom URL to Load" : "URL Preview"}
            value={urlInput}
            onChange={setUrlInput}
            placeholder="https://shop.example.com"
            disabled={loadMode !== "custom" && !!shopId}
          />

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Btn onClick={handleLoad} variant="primary" disabled={loading || (!shopId && !urlInput.trim())}>
              {loading ? "Loading…" : loaded ? "Reload" : <><FlaskConical size={14} /> Launch Isolation Session</>}
            </Btn>
            {loaded && <Btn variant="ghost" onClick={handleClearSession}><X size={14} /> Clear Session</Btn>}
            {selectedShop && (
              <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                <Badge label={selectedShop.status} bg={selectedShop.status === "active" ? "#dcfce7" : "#fee2e2"} color={selectedShop.status === "active" ? "#166534" : "#991b1b"} />
                <span style={{ fontSize: 12, color: T.textMuted }}>{selectedShop.ownerName}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ── Frame + Logs ── */}
      {(loaded || loading) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, minHeight: 520 }}>
          {/* Iframe */}
          <Card style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10, background: T.bg }}>
              <div style={{ display: "flex", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
              </div>
              <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: T.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                <Lock size={12} style={{ flexShrink: 0 }} /> {customUrl || urlInput}
              </div>
              <span style={{ fontSize: 10, background: "#fef9c3", color: "#854d0e", padding: "2px 8px", borderRadius: 999, fontWeight: 700 }}>ISOLATED</span>
            </div>
            {loading ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: T.textMuted }}>
                <Loader2 size={32} />
                <div style={{ fontSize: 14, fontWeight: 600 }}>Loading isolated session…</div>
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14, padding: 24, background: T.bg }}>
                {/* In production, this would be a real iframe — sandboxed */}
                {(() => {
                  const LogoIcon = selectedShop ? getLogoIcon(selectedShop.logoIcon) : Globe;
                  return <LogoIcon size={48} color={T.primary} />;
                })()}
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{selectedShop?.name ?? "Custom URL"}</div>
                <div style={{ fontSize: 12, color: T.textMuted, textAlign: "center", lineHeight: 1.6 }}>
                  Isolation frame active for:<br />
                  <code style={{ background: T.surface, border: `1px solid ${T.border}`, padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>{customUrl || urlInput}</code>
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, background: T.surface, border: `1px dashed ${T.border}`, borderRadius: T.radiusCard, padding: "10px 16px", textAlign: "center", display: "flex", alignItems: "center", gap: 8 }}>
                  <Info size={16} style={{ flexShrink: 0 }} /> In production, an iframe sandbox renders here. Cross-origin policies restrict embedding on most external URLs. For full isolation, the shop must be hosted on this platform's domain.
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn size="sm" variant="primary" onClick={() => window.open(customUrl || urlInput, "_blank")}><ArrowUpRight size={14} /> Open in New Tab</Btn>
                  {selectedShop && <Btn size="sm" variant="ghost" onClick={() => window.open(`/auth/shop-login?shopId=${selectedShop.id}`, "_blank")}><ArrowUpRight size={14} /> Admin Panel</Btn>}
                </div>
              </div>
            )}
          </Card>

          {/* Right panel — logs + notes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Session log */}
            <Card style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, fontSize: 12, fontWeight: 700, color: T.textMuted, background: T.bg, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Session Responses
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 6, maxHeight: 260, fontFamily: "monospace" }}>
                {logs.map(log => {
                  const LogIcon = logIcons[log.type];
                  return (
                    <div key={log.id} style={{ fontSize: 11, color: logColors[log.type], display: "flex", gap: 8 }}>
                      <LogIcon size={12} style={{ flexShrink: 0 }} />
                      <span style={{ flex: 1, lineHeight: 1.5 }}>{log.message}</span>
                    </div>
                  );
                })}
                <div ref={logEndRef} />
              </div>
              {/* Console input */}
              <div style={{ borderTop: `1px solid ${T.border}`, padding: "8px 10px", display: "flex", gap: 8 }}>
                <input value={consoleInput} onChange={e => setConsoleInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleConsoleSubmit()}
                  placeholder="Type command (help)…"
                  style={{ flex: 1, padding: "6px 10px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 12, fontFamily: "monospace", color: T.text, background: T.surface, outline: "none" }} />
                <Btn size="sm" variant="ghost" onClick={handleConsoleSubmit}>Run</Btn>
              </div>
            </Card>

            {/* Notes */}
            <Card style={{ padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Session Notes</div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Record observations, issue details, support decisions…"
                rows={5}
                style={{ width: "100%", padding: "8px 10px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 12, color: T.text, background: T.surface, resize: "vertical", fontFamily: T.fontFamily, boxSizing: "border-box" }} />
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <Btn size="sm" variant="primary" onClick={() => { addLog("info", `Note saved: ${notes.slice(0, 60)}…`); addToast("Session note saved.", "success"); }}>Save Note</Btn>
                <Btn size="sm" variant="ghost" onClick={() => setNotes("")}>Clear</Btn>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loaded && !loading && (
        <Card style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}><FlaskConical size={52} color={T.textMuted} /></div>
          <h3 style={{ margin: "14px 0 8px", color: T.text }}>Isolation Lab</h3>
          <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.6, maxWidth: 440, margin: "0 auto 20px" }}>
            Select a registered shop or enter a custom URL to open it in an isolated sandbox. Monitor responses, run diagnostics, and take session notes — all without impacting production.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            {[{ icon: Lock, text: "Isolated from live data" }, { icon: ClipboardList, text: "Session logging" }, { icon: FileText, text: "Support notes" }].map(f => (
              <div key={f.text} style={{ fontSize: 12, color: T.textMuted, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <f.icon size={22} />
                {f.text}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
