import React, { useState, useRef, useEffect } from "react";
import { SA_THEME as T } from "../../data/theme";
import type { DBQuery, DBResult } from "../../types/index";
import { Card, Btn, SectionHeader, Badge } from "../layout/UI";
import { genId } from "../../utils/helpers";

interface Props {
  addToast: (msg: string, type?: string) => void;
}

const SAVED_QUERIES = [
  { label: "All active shops", sql: "SELECT id, name, status, package_name, expires_at FROM shops WHERE status = 'active' ORDER BY name;" },
  { label: "Shops expiring in 14 days", sql: "SELECT id, name, owner_email, expires_at FROM shops WHERE expires_at BETWEEN NOW() AND NOW() + INTERVAL 14 DAY;" },
  { label: "Abandoned carts (last 7 days)", sql: "SELECT shop_id, COUNT(*) as cart_count, SUM(cart_value) as total_value FROM carts WHERE status = 'abandoned' AND created_at >= NOW() - INTERVAL 7 DAY GROUP BY shop_id;" },
  { label: "Revenue by package", sql: "SELECT p.name as package, COUNT(s.id) as shops, SUM(s.total_revenue) as revenue FROM shops s JOIN packages p ON s.package_id = p.id GROUP BY p.name ORDER BY revenue DESC;" },
  { label: "Top 10 products by sales", sql: "SELECT product_name, shop_name, SUM(quantity) as units_sold, SUM(line_total) as revenue FROM order_items GROUP BY product_id ORDER BY revenue DESC LIMIT 10;" },
  { label: "Open support tickets", sql: "SELECT t.id, t.subject, t.priority, s.name as shop, t.created_at FROM tickets t JOIN shops s ON t.shop_id = s.id WHERE t.status IN ('open','in_progress') ORDER BY t.priority DESC, t.created_at ASC;" },
];

// Mock query executor
function executeMockQuery(sql: string): { result?: DBResult; error?: string; duration: number } {
  const start = Date.now();
  const upper = sql.trim().toUpperCase();

  if (!upper.startsWith("SELECT") && !upper.startsWith("SHOW") && !upper.startsWith("DESCRIBE") && !upper.startsWith("EXPLAIN")) {
    return { error: "Only SELECT, SHOW, DESCRIBE, and EXPLAIN statements are permitted in this terminal. Write operations require direct database access.", duration: Date.now() - start };
  }

  if (upper.includes("FROM SHOPS")) {
    return {
      duration: Date.now() - start + Math.random() * 80,
      result: {
        columns: ["id", "name", "status", "package_name", "total_revenue", "expires_at"],
        rows: [
          { id: "shop_001", name: "FreshMart", status: "active", package_name: "Growth", total_revenue: 1284500, expires_at: "2026-07-15" },
          { id: "shop_002", name: "TechZone", status: "active", package_name: "Pro", total_revenue: 3567000, expires_at: "2026-07-01" },
          { id: "shop_003", name: "Mama Mboga", status: "trial", package_name: "Starter", total_revenue: 12400, expires_at: "2026-06-30" },
          { id: "shop_004", name: "StyleHub", status: "suspended", package_name: "Growth", total_revenue: 678900, expires_at: "2026-08-10" },
          { id: "shop_005", name: "AutoParts KE", status: "pulled_down", package_name: "Starter", total_revenue: 245000, expires_at: "2026-01-20" },
          { id: "shop_006", name: "BookNest", status: "active", package_name: "Enterprise", total_revenue: 890000, expires_at: "2026-09-15" },
        ],
      },
    };
  }
  if (upper.includes("FROM PACKAGES") || upper.includes("FROM CARTS") || upper.includes("FROM TICKETS") || upper.includes("FROM ORDER_ITEMS")) {
    return {
      duration: Date.now() - start + Math.random() * 60,
      result: {
        columns: ["id", "name", "value"],
        rows: [
          { id: "row_1", name: "Sample record A", value: 4200 },
          { id: "row_2", name: "Sample record B", value: 1800 },
          { id: "row_3", name: "Sample record C", value: 9750 },
        ],
      },
    };
  }
  return {
    duration: Date.now() - start + Math.random() * 40,
    result: { columns: ["result"], rows: [{ result: "Query executed. No rows returned." }] },
  };
}

export function DBTerminalModule({ addToast }: Props) {
  const [sql, setSql] = useState(SAVED_QUERIES[0].sql);
  const [history, setHistory] = useState<DBQuery[]>([]);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"terminal" | "history">("terminal");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const run = () => {
    if (!sql.trim()) return;
    setRunning(true);
    setTimeout(() => {
      const { result, error, duration } = executeMockQuery(sql);
      const q: DBQuery = {
        id: genId("q"),
        sql: sql.trim(),
        result,
        error,
        executedAt: new Date().toISOString(),
        executedBy: "Alex Kariuki (sa_001)",
        rowCount: result?.rows.length,
        duration: Math.round(duration),
      };
      setHistory(h => [...h, q]);
      setRunning(false);
      if (error) addToast("Query error — check the terminal.", "error");
      else addToast(`✓ ${q.rowCount} row(s) returned in ${q.duration}ms`, "success");
      setActiveTab("terminal");
    }, 600);
  };

  const lastQuery = [...history].reverse().find(q => q.sql === sql.trim()) ?? history[history.length - 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader
        title="🖥️ DB Terminal"
        subtitle="Direct SQL access — read-only. Full privilege required."
        actions={<Badge label="Full Privilege Only" bg="#ede9fe" color="#5b21b6" />}
      />

      {/* Warning banner */}
      <div style={{ background: "#fef9c3", border: "1px solid #f59e0b", borderRadius: T.radiusCard, padding: "10px 16px", fontSize: 13, color: "#854d0e", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <span><strong>Read-only terminal.</strong> Only SELECT, SHOW, DESCRIBE, and EXPLAIN are permitted. All queries are logged with your admin credentials. This tool is audited.</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
        {/* Saved queries */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Saved Queries</div>
          {SAVED_QUERIES.map(q => (
            <button key={q.label} onClick={() => setSql(q.sql)} style={{
              background: sql === q.sql ? T.primaryLight : T.surface,
              border: `1px solid ${sql === q.sql ? T.primary : T.border}`,
              borderRadius: T.radius, padding: "8px 12px", fontSize: 12, color: sql === q.sql ? T.primary : T.text,
              fontWeight: sql === q.sql ? 700 : 400, cursor: "pointer", textAlign: "left", transition: "all .15s",
              fontFamily: T.fontFamily, lineHeight: 1.4,
            }}>{q.label}</button>
          ))}
        </div>

        {/* Main terminal */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* SQL editor */}
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", background: T.black, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)", fontFamily: "monospace" }}>SQL ›</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,.3)", marginLeft: "auto" }}>Ctrl + Enter to run</span>
            </div>
            <textarea
              ref={textareaRef}
              value={sql}
              onChange={e => setSql(e.target.value)}
              onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); } }}
              rows={7}
              style={{
                width: "100%", padding: "14px 16px", border: "none", outline: "none", resize: "vertical",
                fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: 13, color: "#e2e8f0",
                background: "#1a2035", lineHeight: 1.7, boxSizing: "border-box",
              }}
            />
            <div style={{ padding: "10px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 10, alignItems: "center" }}>
              <Btn variant="accent" onClick={run} disabled={running || !sql.trim()}>
                {running ? "⏳ Running…" : "▶ Run Query"}
              </Btn>
              <Btn variant="ghost" size="sm" onClick={() => setSql("")}>Clear</Btn>
              <span style={{ marginLeft: "auto", fontSize: 12, color: T.textMuted }}>{history.length} quer{history.length === 1 ? "y" : "ies"} this session</span>
            </div>
          </Card>

          {/* Results */}
          {lastQuery && (
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10, background: T.bg }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Result</span>
                {lastQuery.result && (
                  <>
                    <Badge label={`${lastQuery.rowCount} rows`} bg={T.successLight} color={T.success} />
                    <Badge label={`${lastQuery.duration}ms`} bg={T.bg} color={T.textMuted} />
                  </>
                )}
                {lastQuery.error && <Badge label="Error" bg="#fee2e2" color="#991b1b" />}
                <span style={{ marginLeft: "auto", fontSize: 11, color: T.textMuted }}>{new Date(lastQuery.executedAt).toLocaleTimeString()}</span>
              </div>

              {lastQuery.error ? (
                <div style={{ padding: 16, fontFamily: "monospace", fontSize: 13, color: T.danger, background: "#fff5f5", lineHeight: 1.6 }}>
                  <strong>Error:</strong> {lastQuery.error}
                </div>
              ) : lastQuery.result ? (
                <div style={{ overflowX: "auto", maxHeight: 320 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead style={{ position: "sticky", top: 0, background: T.bg, zIndex: 1 }}>
                      <tr>
                        {lastQuery.result.columns.map(col => (
                          <th key={col} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: T.textMuted, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap", fontFamily: "monospace" }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lastQuery.result.rows.map((row, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}
                          onMouseEnter={e => e.currentTarget.style.background = T.bg}
                          onMouseLeave={e => e.currentTarget.style.background = ""}>
                          {lastQuery.result!.columns.map(col => (
                            <td key={col} style={{ padding: "8px 12px", color: T.text, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                              {row[col] === null ? <span style={{ color: T.textMuted, fontStyle: "italic" }}>NULL</span> : String(row[col])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </Card>
          )}

          {/* Query history */}
          {history.length > 0 && (
            <Card>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Query History</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
                {[...history].reverse().map(q => (
                  <div key={q.id} onClick={() => setSql(q.sql)} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "7px 10px",
                    borderRadius: T.radius, cursor: "pointer", transition: "background .12s",
                    background: T.bg,
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = T.border}
                    onMouseLeave={e => e.currentTarget.style.background = T.bg}>
                    <span style={{ fontSize: 14 }}>{q.error ? "❌" : "✅"}</span>
                    <span style={{ flex: 1, fontSize: 11, fontFamily: "monospace", color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.sql}</span>
                    <span style={{ fontSize: 10, color: T.textMuted, flexShrink: 0 }}>{q.rowCount ?? "err"} rows · {q.duration}ms</span>
                  </div>
                ))}
                <div ref={historyEndRef} />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
